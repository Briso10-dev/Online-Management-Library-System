import { Request,Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import sendError from "../core/constants/errors";

const prisma = new PrismaClient() //orm creation

export const userControlleurs = {
    // get user profile
    getusers : async (req:Request, res:Response) =>{
        const {id} = req.params
        
        try {
            const userFind = await prisma.user.findUnique({
                where: {
                    userID : id
                }
            })
           if (userFind)
            res.json(userFind)
           else res.json({msg:"User info's failed retrieval"}).status(HttpCode.NOT_FOUND)

        }catch (error) {
            sendError(res,error)
        }
    }
}

