import express from "express";
const router = express.Router();
import {
    addSelectedPlayer, updatedPlayerInTeam, deletedSelectedPlayer, getDetailsSelectedPlayer, getSelectedPlayerList, getNotSelectedPlayerList
} from "../controller/selectedPlayer.controller";

router.get("/notSelected", getNotSelectedPlayerList)
router.get("/", getSelectedPlayerList)
router.get("/:id", getDetailsSelectedPlayer)
router.post("/add", addSelectedPlayer)
router.put("/:teamId/:playerId", updatedPlayerInTeam)
router.delete("/:selectedPlayerId", deletedSelectedPlayer)




export default router;
