import { Router } from "express";
import { handleGetPlayer } from "../controllers/playerController";

const playerRouter = Router();

playerRouter.get("/:name", handleGetPlayer);

export { playerRouter };