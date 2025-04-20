import { Router } from "express";
import { handleGetStatus } from "../controllers/statutsController";

const statusRouter = Router();

statusRouter.get("/:name", handleGetStatus);

export { statusRouter };