import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import sendMail from "../core/config/send.mail";

const prisma = new PrismaClient()

export const notifBorrowed = async (req: Request, res: Response) => {
    try {
        const userBorrowed = await prisma.borrow.findMany({
            select: {
                userBrorrow: {
                    select: {
                        userID: true,
                        // Add other user fields you need for notifications
                        email: true,
                        name: true,
                    }
                },
                borrowBook: {
                    select: {
                        title: true,
                        // Add other book fields you might need
                    }
                },
                returnDate: true,
            }
        });

        if (userBorrowed.length === 0) {
            return res.status(HttpCode.NOT_FOUND).json({ msg: "No borrowed books found" });
        }
        // Extract relevant information
        const email = JSON.stringify(userBorrowed.map(borrow => ({
            email: borrow.userBrorrow.email
        })));
        sendMail(email,"This is an anonymous connection",`Oh yess,the book will soon be available`)
        return res.status(HttpCode.OK).json({msg:"check your email box"});  
    } catch (error) {
        sendError(res, error);
    }
}