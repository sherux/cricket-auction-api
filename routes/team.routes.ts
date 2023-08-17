import express from "express";
const router = express.Router();
import {
    addTeam, updatedTeam, deletedTeam, getDetailsTeam, getTeamList
} from "../controller/team.controller";


router.get("/", getTeamList)
router.get("/:id", getDetailsTeam)
router.post("/add", addTeam)
router.put("/:id", updatedTeam)
router.delete("/:id", deletedTeam)




export default router;
