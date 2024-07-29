import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { userValidator } from "../middleware/validator.middleware";

export const userRoute = Router()

// User definition of routes
// get user profile
userRoute.get("/profile/:id",userControllers.getUser)
// user inscription
userRoute.post("/signup",userValidator, userControllers.createUser)
// user connexion
userRoute.post("/login",userControllers.loginUser)
// user deconnexion
userRoute.post("/logout")
// update user profile
userRoute.put("/profile/:id",userValidator,userControllers.updateUser)
// delete an acount user
userRoute.delete("/profile/:id",userControllers.deleteUser)