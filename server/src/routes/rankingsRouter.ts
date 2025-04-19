import { Router } from "express";
import { getFilteredRankings, getAllRankings } from "../controllers/rankingsController";

const rankingsRouter = Router();

rankingsRouter.get("/:name/all", getAllRankings);
rankingsRouter.get("/:name", getFilteredRankings);

export { rankingsRouter };