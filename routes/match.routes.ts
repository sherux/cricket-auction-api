import express from "express";
const router = express.Router();
import { addMatch, resultMatches, deletedMacth, getDetailsMatch, getMatchList } from "../controller/match.controller";


router.get("/", getMatchList)
router.get("/:id", getDetailsMatch)
router.post("/add", addMatch)
router.post("/result", resultMatches)
router.delete("/:id", deletedMacth)




export default router;
