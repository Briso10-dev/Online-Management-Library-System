import { Request, Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import sendError from "../core/constants/errors";
import { HttpCode } from "../core/constants";

const prisma = new PrismaClient()

export const middlewareBook = {
    ifBorrowedBook: async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { bookID } = req.body

            const [borrow,book] = await Promise.all([
                prisma.borrow.findFirst({
                    where: {
                        borrowBookID : bookID
                    }
                }),
                prisma.book.findFirst({
                    where:{
                        bookID
                    }
                })
            ])
            if(!borrow && book?.state==true){
                next()
            }else if(borrow && borrow.borrowDate < borrow.returnDate) //assuming that if the book is borrowed,then it exists
                next()
            if(borrow && book)
                return res.status(HttpCode.FORBIDDEN).json({msg:"Book not available"})
        } catch (error) {
            sendError(res,error)
        }
    }
}