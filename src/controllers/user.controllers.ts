import { Request,Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import chalk from 'chalk'
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator";
import tokenOps from "../core/config/jwt.functions";

const prisma = new PrismaClient() //orm creation

export const userControlleurs = {
    // get user profile
    getUser : async (req:Request, res:Response) =>{
        const {id} = req.params
        
        try {
            const userProfile = await prisma.user.findUnique({
                where: {
                    userID : id
                }
            })
           if (userProfile)
            res.json(userProfile)
           else res.json({msg:"User info's failed retrieval"}).status(HttpCode.NOT_FOUND)

        }catch (error) {
            sendError(res,error)
        }
    },
    createUser : async (req:Request,res:Response)=>{
         // Check for validation errors
         const errors = validationResult(req);
         if (!errors.isEmpty()) 
             return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
 
        try {
            const {name,email,password} = req.body

            const passHash = await bcrypt.hash(password,10)
               const user = await prisma.user.create({
                data : {
                    name,
                    email,
                    password : passHash
                }
               })
               if(user)
                    res.status(HttpCode.CREATED).json(user)
               else
                    res.status(HttpCode.BAD_REQUEST).json({msg:"User could not be created !"})            
        } catch (error) {
            sendError(res,error)
        }
    },
    loginUser : async (req:Request,res:Response)=>{
        try {
            const {email,password} = req.body

            const user = await prisma.user.findFirst({
                where:{
                    email
                },
            })
            if(user){
                const testPass = await bcrypt.compare(password,user.password)
                if(testPass){
                    // jwt token generation
                    const accessToken = tokenOps.generateAccessToken(user)
                    const refreshToken= tokenOps.generateRefreshToken(user)
                    user.password = " "
                    res.cookie(" User successfully connected",refreshToken,{httpOnly: true, secure: true}) //refresh token stored in cookie
                    res.json({ msg: "User successfully logged in" }).status(HttpCode.OK)
                }else res.json({msg:"Invalid infos enterd"})
            }else console.log(chalk.red("No user found"))

        } catch (error) {
            sendError(res,error)
        }
    }
}

