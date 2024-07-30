import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

const prisma = new PrismaClient() //orm creation

export const borrowControllers = {
    createBorrow: async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

            const borrowDate = new Date(Date.now())
            const returnDate = new Date(borrowDate.getTime() + 10 * 60 * 1000)

            const { bookID, userID } = req.body
            //finding the borrowed book and user borrowing
            const [book, user] = await Promise.all([
                prisma.book.findUnique({ where: { bookID } }),
                prisma.user.findUnique({ where: { userID } })
            ]);
            //checking if actual user and book is found
            if (!book || !user) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Infos provided not found" });
            }
            //checking first the status of the book borrowed
            if (book.state === false) {
                return res.status(HttpCode.BAD_REQUEST).json({ message: "Book is already borrowed" });
            }
            //creation of borrow
            const borrow = await prisma.borrow.create({
                data: {
                    borrowDate,
                    returnDate,
                    borrowBookID: bookID,
                    userBorrowID: userID
                }
            });
            // Update book state to borrowed
            await prisma.book.update({
                where: { bookID },
                data: { state: false }
            });
            return res.status(HttpCode.CREATED).json(borrow)

        } catch (error) {
            sendError(res, error)
        }

    }
}