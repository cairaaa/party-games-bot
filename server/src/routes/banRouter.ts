import { Router } from "express";
import { banPlayer, unbanPlayer } from "../controllers/banController";
import { banPlayerOne, unbanPlayerOne } from "../controllers/banController";

const banRouter = Router();

banRouter.post("/:name", banPlayer);
banRouter.delete("/:name", unbanPlayer);

banRouter.post("/:name/:minigame/:lbType", banPlayerOne);
banRouter.delete("/:name/:minigame/:lbType", unbanPlayerOne);

export { banRouter };