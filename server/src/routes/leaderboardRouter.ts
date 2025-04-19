import { Router } from "express";
import { handleGetLeaderboard } from "../controllers/leaderboardController";

const leaderboardRouter = Router();

leaderboardRouter.get("/:minigame/:lbType", handleGetLeaderboard);

export { leaderboardRouter };
