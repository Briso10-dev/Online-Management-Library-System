import { Request, Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import sendError from "../core/constants/errors";
import { HttpCode } from "../core/constants";

const prisma = new PrismaClient()

export const middlewareBook = {
    verifyBorrowed: async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { userID } = req.params
            const { bookID } = req.body

            const [borrow, book] = await Promise.all([
                prisma.borrow.findFirst({
                    where: {
                        userBorrowID: userID
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
            
            next()
        } catch (error) {
            sendError(res,error)
        }
    }
}