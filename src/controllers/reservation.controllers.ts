import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const prisma = new PrismaClient()

export const reservesControllers ={
    createReservation : async (req:Request,res:Response)=>{
        try {
            const {userID} = req.params
            const {bookID} = req.body

            const reservations = await prisma.reservation.create({
                data:{
                    userReserveID :userID,
                    bookReserveID : bookID
                }
            })
            if(!reservations)
                res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"You could not reserve"})
            return res.status(HttpCode.OK).json(reservations)
        } catch (error) {
            sendError(res,error)
        }
    }
}