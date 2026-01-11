import express from "express"
import {signup,login, logout, checkAuth} from "../controller/authController.js"
import { isAuth } from "../middleware/isAuth.js";


const authRouter=express.Router();

authRouter.get("/me",isAuth,checkAuth)

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)



export default authRouter;