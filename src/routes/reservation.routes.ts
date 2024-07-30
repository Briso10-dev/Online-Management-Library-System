import { Router } from "express";
import { reservesControllers } from "../controllers/reservation.controllers";
import { middlewareBook } from "../middleware/book.middleware";

export const routeReserved = Router()

//CREATE API for a reservation 
routeReserved.post("/:userID",middlewareBook.verifyBorrowed,reservesControllers.createReservation)