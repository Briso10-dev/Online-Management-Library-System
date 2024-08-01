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
                        email: true,
                        name: true,
                    }
                },
                borrowBook: {
                    select: {
                        bookID:true,
                        title: true
                    }
                },
                returnDate: true,
            }
        });

        if (userBorrowed.length === 0) {
            return res.status(HttpCode.NOT_FOUND).json({ msg: "No borrowed books found" });
        }
        // Extract email for sending mail
        const email = JSON.stringify(userBorrowed.map(borrow => ({
            email: borrow.userBrorrow.email
        })));
        // Extraction of needed notification infos 
        const message = "book availability"
        const userNotifID = JSON.stringify(userBorrowed.map(borrow => ({
            userNotifID: borrow.userBrorrow.userID,
        })));
        console.log({userNotifID})
        const notifBookID = JSON.stringify(userBorrowed.map(borrow => ({
            bookID : borrow.borrowBook.bookID
        })));
        sendMail(email,"This is an anonymous connection",`Oh yess,the book will soon be available`)
        // updating notification table
        await prisma.notification.create({
            data:{
                message,
                userNotifID,
                notifBookID
            }
        })
        return res.status(HttpCode.OK).json({msg:"check your email box"});  
    } catch (error) {
        sendError(res, error);
    }
}