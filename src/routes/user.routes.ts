import { Router } from "express";
import { userControlleurs } from "../controllers/user.controllers";
import { loginValidator } from "../middleware/validator.middleware";

export const userRoute = Router()

// User definition of routes
// get user profile
userRoute.get("/profile/:id",userControlleurs.getUser)
// user inscription
userRoute.post("/signup",loginValidator, userControlleurs.createUser)
// user connexion
userRoute.post("/login",userControlleurs.loginUser)
// user deconnexion
userRoute.post("/logout")
// update user profile
userRoute.put("/profile")
// delete an acount user
userRoute.delete("/profile")