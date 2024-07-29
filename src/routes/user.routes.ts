import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { loginValidator } from "../middleware/validator.middleware";

export const userRoute = Router()

// User definition of routes
// get user profile
userRoute.get("/profile/:id",userControllers.getUser)
// user inscription
userRoute.post("/signup",loginValidator, userControllers.createUser)
// user connexion
userRoute.post("/login",userControllers.loginUser)
// user deconnexion
userRoute.post("/logout")
// update user profile
userRoute.put("/profile/:id",loginValidator,userControllers.updateUser)
// delete an acount user
userRoute.delete("/profile/:id",userControllers.deleteUser)