import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callLeaderboard } from "../services/callServer";
import { colour } from "../types/colours";
import { LeaderboardInterface } from "@shared-types/interfaces";
import { initializeLeaderboardCanvas } from "../services/initializeCanvases";
import { LbType, Minigame } from "@shared-types/types";
import { leaderboardTitles } from "../types/leaderboardOptions";

function drawTitle(
  ctx: CanvasRenderingContext2D, 
  minigame: Minigame, 
  lbType: LbType
): void {
  const lb = `${minigame} ${lbType}`;
  const title = leaderboardTitles.get(lb);
  if (!title) {
    throw new Error("invalid lb");
  }

  ctx.font = "150px Bold";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "center";
  ctx.fillText(title, 1280, 300);
};

function drawPlayers(ctx: CanvasRenderingContext2D, lb: LeaderboardInterface): void {
  ctx.font = "55px Regular";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "start";

  const start = 455;
  const spacing = 105;
  for (let i = 0; i < 10; i++) {
    const rank = i + 1;
    const player = lb.players[i];
    ctx.fillText(`${rank}. ${player.username}`, 175, start + spacing * i);
  }
  for (let i = 10; i < 20; i++) {
    const rank = i + 1;
    const player = lb.players[i];
    ctx.fillText(`${rank}. ${player.username}`, 928, start + spacing * (i-10));
  }
  for (let i = 20; i < 30; i++) {
    const rank = i + 1;
    const player = lb.players[i];
    ctx.fillText(`${rank}. ${player.username}`, 1682, start + spacing * (i-20));
  }

  ctx.font = "55px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "end";

  for (let i = 0; i < 10; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, 878, start + spacing * i);
  }
  for (let i = 10; i < 20; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, 1657, start + spacing * (i-10));
  }
  for (let i = 20; i < 30; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, 2335, start + spacing * (i-20));
  }
}

export async function createLeaderboardsCanvas(
  minigame: Minigame,
  lbType: LbType
): Promise<Buffer | string> {
  const canvas = await initializeLeaderboardCanvas(minigame);
  const ctx = canvas.getContext("2d");
  const response = await callLeaderboard(minigame, lbType);
  if (!response.success) {
    return response.error.message;
  }
  const lb = response.data;
  drawTitle(ctx, minigame, lbType);
  drawPlayers(ctx, lb);
  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync("./src/canvas/output.png", buffer);
  return buffer;
};

import { registerFonts } from "../services/registerFonts";
import fs from "fs";
registerFonts();
await createLeaderboardsCanvas("jigsawRush", "miniWins");