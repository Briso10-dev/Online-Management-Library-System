import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import chalk from 'chalk'
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

const prisma = new PrismaClient() //orm creation

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
}

