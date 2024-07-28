import { Router } from "express";
import { userControlleurs } from "../controllers/user.controllers";

export const userRoute = Router()

// User definition of routes
// get user profile
userRoute.get("/profile/:id",userControlleurs.getusers)
// user inscription
userRoute.post("/signup",)
// user connexion
userRoute.post("/login")
// user deconnexion
userRoute.post("/logout")
// update user profile
userRoute.put("/profile")
// delete an acount user
userRoute.delete("/profile")