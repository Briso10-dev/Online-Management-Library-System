import { Router } from "express";
import { notifBorrowed } from "../controllers/notification.controllers";

export const routeNotif = Router()

// API to send notifications to all users
routeNotif.post("/",notifBorrowed)