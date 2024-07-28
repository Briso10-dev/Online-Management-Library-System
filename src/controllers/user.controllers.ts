import { Request,Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient() //orm creation

export const userControlleurs = {
    // get user profile
    getusers : async (req:Request, res:Response) =>{
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
    createuser : async (req:Request,res:Response)=>{
        const {name,email,password} = req.body

        try {
            const passHash = await bcrypt.hash(password,10)
               const user = prisma.user.create({
                data : {
                    name,
                    email,
                    password : passHash
                }
               })
               if(user)
                    res.json(user).status(HttpCode.OK)
               else
                    res.json({msg:"User could not be created"})            
        } catch (error) {
            sendError(res,error)
        }
    }
}

