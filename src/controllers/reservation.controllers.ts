import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import sendMail from "../core/config/send.mail";
import { decision } from "../middleware/book.middleware";

const prisma = new PrismaClient()

export const reservesControllers = {
    createReservation: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params
            const { bookID } = req.body

            const reservations = await prisma.reservation.create({
                data: {
                    userReserveID: userID,
                    bookReserveID: bookID
                }
            })
            if (!reservations)
                res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "You could not reserve" })
            return res.status(HttpCode.OK).json(reservations)
        } catch (error) {
            sendError(res, error)
        }
    },
    sendmailBook: async (req: Request, res: Response) => {
        try {
            const { bookID, email } = req.body

            const [user, reservation] = await Promise.all([
                prisma.user.findUnique({
                    where: {
                        email
                    }
                }),
                prisma.reservation.findFirst({
                    where: {
                        bookReserveID: bookID
                    }
                })
            ])
            if (!reservation || !user)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "You did not reserved a book or wrong email entered" })
            const message = "Book availability"
            if (decision) {
                //sending mail to confirm user book availability
                sendMail(email, "This is an anonymous connection!", "Oh yess, the book is now available")
                // updating notification table
                await prisma.notification.create({
                    data: {
                        message,
                        userNotifID: user.userID,
                        notifBookID: bookID
                    }
                })
                return res.status(HttpCode.OK).json({ msg: "check your email box" });
            }else
                return

        } catch (error) {
            sendError(res, error)
        }
    }
}