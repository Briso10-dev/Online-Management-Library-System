import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import sendMail from "../core/config/send.mail";
import EmailTemplate from "../core/template";

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
                        bookID: true,
                        title: true
                    }
                },
                returnDate: true,
            }
        });

        if (userBorrowed.length === 0) {
            return res.status(HttpCode.NOT_FOUND).json({ msg: "No borrowed books found" });
        }

        const message = "Book availability notification";

        // Creating notifications for each borrowed book
        const notifications = userBorrowed.map(borrow => ({
            message,
            userNotifID: borrow.userBrorrow.userID,
            notifBookID: borrow.borrowBook.bookID
        }));

        // Creating notification for each user
        await prisma.notification.createMany({
            data: notifications
        });
    
        // Sending emails to users
        for (const borrow of userBorrowed

        ) {
             sendMail(borrow.userBrorrow.email,"Book Availability Notification",await EmailTemplate.Reminder(12,"","",""));
        }

        return res.status(HttpCode.OK).json({ msg: "Notifications sent and stored successfully" });
    } catch (error) {
        sendError(res, error);
    }
}