import { Router } from "express";
import { borrowControllers } from "../controllers/borrow.controllers";
import { borrowValidator } from "../middleware/validator.middleware";

export const borrowRoute = Router()

// borrow routes
borrowRoute.post("/",borrowValidator, borrowControllers.createBorrow)