import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import chalk from 'chalk'
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator";
import tokenOps from "../core/config/jwt.functions";

const prisma = new PrismaClient() //orm creation

export const userControllers = {
    // get user profile
    getUser: async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const userProfile = await prisma.user.findUnique({
                where: {
                    userID: id
                }
            })
            if (userProfile)
                res.json(userProfile)
            else res.json({ msg: "User info's failed retrieval" }).status(HttpCode.NOT_FOUND)

        } catch (error) {
            sendError(res, error)
        }
    },
    createUser: async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

        try {
            const { name, email, password } = req.body

            const passHash = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passHash
                }
            })
            if (user)
                res.status(HttpCode.CREATED).json(user)
            else
                res.status(HttpCode.BAD_REQUEST).json({ msg: "User could not be created !" })
        } catch (error) {
            sendError(res, error)
        }
    },
    loginUser: async (req:Request, res: Response) => {
        try {
        
            const { email, password } = req.body

            const user = await prisma.user.findFirst({
                where: {
                    email
                },
            })
            if (user) {
                const testPass = await bcrypt.compare(password, user.password)
                if (testPass) {
                    // jwt token generation
                    const accessToken = tokenOps.generateAccessToken(user)
                    const refreshToken = tokenOps.generateRefreshToken(user)
                    user.password = " "
                    res.cookie(`${user.name}-cookie`, refreshToken, { 
                    httpOnly: true, 
                    secure: true,
                    maxAge : 30 * 24 * 60 * 1000
                     }) //refresh token stored in cookie
                    console.log(accessToken)
                    res.json({ msg: "User successfully logged in" }).status(HttpCode.OK)
                } else res.json({ msg: "Invalid infos enterd" })
            } else console.log(chalk.red("No user found"))

        } catch (error) {
            sendError(res, error)
        }
    },
    logoutUser: async (req: Request, res: Response) => {
        try {
         
            const { email } = req.body
            //confirming first by email if user exists 
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            if (user) {
                   // obtaiining user's token
                const accessToken = req.headers.authorization
                const refreshToken = req.cookies['Dreamer-cookie']
                // verifying if token exists
                if (!accessToken || !refreshToken)
                    return res.status(HttpCode.UNAUTHORIZED).json({ message: "Unauthorized: No token available or expired" });

                const decodedUser = await tokenOps.verifyAccessToken(refreshToken);
                if (decodedUser) {
                    res.clearCookie('Dreamer-cookie')
                    console.log("user went out")
                    return res.status(HttpCode.OK).json({ msg: "User succesffully logout" })
                } else res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ msg: "Invalid or expired token" })
            }
        } catch (error) {
            sendError(res, error)
        }
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params //obtaining a user's id
            const { name, email, password } = req.body //obtaining modified users's info

            const passHash = await bcrypt.hash(password, 10)

            const updateUser = await prisma.user.update({
                where: {
                    userID: id
                },
                data: {
                    name,
                    email,
                    password: passHash
                }
            })
            if (updateUser) res.status(HttpCode.OK).json({ msg: "User succesfully updated" })
            else res.status(HttpCode.BAD_REQUEST).json({ msg: "enterd correct infos" })
        } catch (error) {
            sendError(res, error)
        }
    },
    // deletion of a user's profile
    deleteUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const deleteUser = await prisma.user.delete({
                where: {
                    userID: id
                },
            })
            if (deleteUser)
                res.json({ msg: "user successfully deleted" })
            else res.send({ msg: "could not delete user" })
        } catch (error) {
            sendError(res, error)
        }
    },
}

