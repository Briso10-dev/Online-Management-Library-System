import { Router } from "express";
import { bookControllers } from "../controllers/book.controllers";
import { bookValidator } from "../middleware/validator.middleware";

export const bookRoute = Router()

// User definition of routes
// get user profile
bookRoute.get("/",bookControllers.getBook)
// user inscription
bookRoute.post("/",bookValidator,bookControllers.createBook)
// user connexion
bookRoute.post("/",)
// user deconnexion
bookRoute.post("/",)
// update user profile
bookRoute.put("/",)
// delete an acount user
bookRoute.delete("/",)