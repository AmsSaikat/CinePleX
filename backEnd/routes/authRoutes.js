import express from "express"
import {signup,login, logout, checkAuth} from "../controller/authController.js"
import { isAuth } from "../middleware/isAuth.js";
import { assignModerator, kickUser, transferHost, updateTheaterSettings } from "../controller/theaterController.js";


const authRouter=express.Router();

authRouter.get("/me",isAuth,checkAuth)

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/logout",logout)


authRouter.post("/kick", isAuth, kickUser);
authRouter.put("/settings", isAuth, updateTheaterSettings);
authRouter.put("/transfer-host", isAuth, transferHost);
authRouter.put("/moderator", isAuth, assignModerator);


export default authRouter;