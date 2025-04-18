import { Router } from "express";
import { handleGetPlayer } from "../controllers/playerController";

const router = Router();

router.get("/:name", handleGetPlayer);

export default router;