import { Router } from "express";
import { bookControllers } from "../controllers/book.controllers";
import { bookValidator } from "../middleware/validator.middleware";

export const bookRoute = Router()

// User definition of routes
// get user profile
bookRoute.get("/",bookControllers.getBook)
// user inscription
bookRoute.post("/",bookValidator,bookControllers.createBook)
// update user profile
bookRoute.put("/:id",bookControllers.updateBook)
// delete an acount user
bookRoute.delete("/",)