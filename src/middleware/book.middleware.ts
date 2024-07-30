import { Request,response } from "express";
import { PrismaClient } from "@prisma/client";
import sendMail from "../core/config/send.mail";

const prisma = new PrismaClient()

export const availableBook = (req:Request,res:Response)=>{
    
}