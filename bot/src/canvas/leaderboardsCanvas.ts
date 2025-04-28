import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callLeaderboard } from "../services/callServer";
import { colour } from "../types/colours";
import { LeaderboardInterface } from "@shared-types/interfaces";
import { initializeLeaderboardCanvas } from "../services/initializeCanvases";
import { LbType, Minigame } from "@shared-types/types";

export async function createLeaderboardsCanvas(
  minigame: Minigame,
  lbType: LbType
): Promise<Buffer | string> {
  const canvas = await initializeLeaderboardCanvas(minigame);
  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
};