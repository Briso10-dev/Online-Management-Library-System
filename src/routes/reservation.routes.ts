import { Router } from "express";
import { reservesControllers } from "../controllers/reservation.controllers";
import { middlewareBook } from "../middleware/book.middleware";

export const routeReserved = Router()

//CREATE API for a reservation 
routeReserved.post("/create/:userID",middlewareBook.ifBorrowedBook,reservesControllers.createReservation)
routeReserved.post("/verify-book",middlewareBook.ifBorrowedBook,reservesControllers.sendmailBook)