import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import prisma from "../core/config/prisma";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

export const borrowControllers = {
    createBorrow: async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

            const borrowDate = new Date(Date.now())
            const returnDate = new Date(borrowDate.getTime() + 2 * 60 * 1000)
            const { userID } = req.params
            const { bookID } = req.body
            //finding the borrowed book and user borrowing
            const [book, user] = await Promise.all([
                prisma.borrow.findUnique({
                    where: {
                        borrowID: bookID  //if a book is in borrow means therefore it it exists in table book 
                    }
                }),
                prisma.user.findUnique({
                    where: {
                        userID
                    }
                })
            ]);
            //checking if actual user and book is found in table borrowed
            if (!book || !user)
                return res.status(HttpCode.NOT_FOUND).json({ message: "book already borrowed or you are not a correct user" });

            //creation of borrow
            const borrow = await prisma.borrow.create({
                data: {
                    borrowDate,
                    returnDate,
                    borrowBookID: bookID,
                    userBorrowID: userID
                }
            });
            if (!borrow)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "could not borrow" })
            await prisma.book.update({
                where: {
                    bookID
                },
                data: {
                    state: true
                }
            });
            return res.status(HttpCode.CREATED).json(borrow)

        } catch (error) {
            sendError(res, error)
        }

    },
    returnBook: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params
            const { bookID } = req.body

            const [borrow, book] = await Promise.all([
                prisma.borrow.findFirst({
                    where: {
                        userBorrowID : userID
                    }
                }),
                prisma.book.findUnique({
                    where: {
                        bookID
                    }
                })
            ]);
            // Update book state to available if borrow's identifiant actually exists
            if (!borrow || !book)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "You actually did not borrow a book here" })
            const updateBook = await prisma.book.update({
                where: {
                    bookID
                },
                data: {
                    state: true
                }
            });
            if (!updateBook)
                res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "unable to update book's status" })

            return res.status(HttpCode.OK).json({ msg: "Book successfully returned" })

        } catch (error) {
            sendError(res, error)
        }
    },
    getBorrowedBooks: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params

            const userBorrowed = await prisma.borrow.findMany({
                where: {
                    userBorrowID: userID
                }
            })
            if (!userBorrowed)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "wrong userID or userID not found" })
            return res.status(HttpCode.OK).json(userBorrowed)

        } catch (error) {
            sendError(res, error)
        }
    },
}