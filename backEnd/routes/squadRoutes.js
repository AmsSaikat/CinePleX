import express from "express";
import { searchOperatives,addOperativeToSquad,getMySquad,updateSquadSettings,removeMember,leaveSquad,disbandSquad, createSquad,} from "../controller/squadController.js";
import { isAuth } from "../middleware/isAuth.js";

const squadRouter = express.Router();

// --- SQUAD MANAGEMENT ROUTES ---
squadRouter.post("/create", isAuth, createSquad);
squadRouter.get("/my-squad", isAuth, getMySquad);
squadRouter.put("/settings", isAuth, updateSquadSettings);
squadRouter.delete("/disband", isAuth, disbandSquad);

// --- OPERATIVE & MEMBER ROUTES ---
squadRouter.post("/search-operatives", isAuth, searchOperatives);
squadRouter.post("/add", isAuth, addOperativeToSquad);
squadRouter.post("/remove-member", isAuth, removeMember);
squadRouter.post("/leave", isAuth, leaveSquad);

export default squadRouter;