import express from "express";
const router = express.Router();
import { addPlayer, updatedPlayer, deletedPlayer, getDetailsPlayer, getPlayerList } from "../controller/player.controller";


router.get("/", getPlayerList)
router.get("/:id", getDetailsPlayer)
router.post("/add", addPlayer)
router.put("/:id", updatedPlayer)
router.delete("/:id", deletedPlayer)




export default router;
