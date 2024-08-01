import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import prisma from "../core/config/prisma";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

export const bookControllers = {
    // get user profile
    getBook: async (req: Request, res: Response) => {
        try {
            const users = await prisma.book.findMany()
            res.send(users).status(HttpCode.OK)
        } catch (error) {
            sendError(res, error)
        }
    },
    createBook: async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

        try {
            const { title,author,description,publicationYear, ISBN } = req.body

            const book = await prisma.book.create({
                data: {
                    title,
                    author,
                    description,
                    publicationYear,
                    ISBN
                },
            })
            if (book)
                res.status(HttpCode.CREATED).json(book)
            else
                res.status(HttpCode.BAD_REQUEST).json({ msg: "book could not be created !" })
        } catch (error) {
            sendError(res, error)
        }
    },
    // Update book info
    updateBook: async (req: Request, res: Response) => {
        try {
            const { id } = req.params //obtaining a user's id
            const { title,author,description,publicationYear, ISBN } = req.body //obtaining modified book's info

            const updateBook = await prisma.book.update({
                where:{
                    bookID : id
                },
                data:{
                    title,
                    author,
                    description,
                    publicationYear,
                    ISBN
                }
            })
                if (updateBook) res.status(HttpCode.OK).json({msg:"Book succesfully updated"})
                else res.status(HttpCode.BAD_REQUEST).json({msg:"enterd correct infos"})
        } catch (error) {
            sendError(res, error)
        }
    },
     // deletion of a user's profile
     deleteBook: async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const deleteBook = await prisma.book.delete({
                where: {
                    bookID: id
                },
            })
            if (deleteBook)
                res.json({ msg: "book successfully deleted" })
            else res.send({ msg: "could not delete book" })
        } catch (error) {
            sendError(res, error)
        }
    },
}

