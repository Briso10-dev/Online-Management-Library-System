import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import chalk from 'chalk'
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator";
import tokenOps from "../core/config/jwt.functions";

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
   
}

