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
  const start = 455;
  const spacing = 945/11;
  const columnPositions = [175, 928, 1682];
  const valuePositions = [878, 1657, 2335];
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "start";
  
  for (let i = 0; i < 36; i++) {
    const rank = i + 1;
    const player = lb.players[i];
    const columnIndex = Math.floor(i / 12);
    const rowIndex = i % 12;
    const x = columnPositions[columnIndex];
    const y = start + spacing * rowIndex;

    ctx.font = "50px Regular";
    const name = player.username;
    const nameLength = ctx.measureText(player.username).width;
    console.log(nameLength);
    const value = String(player.value);
    const valueLength = value.length * 30;
    
    if (nameLength > 350 && valueLength >= 210 || 
      nameLength > 375 && valueLength >= 180 ||
      nameLength > 400 && valueLength >= 150 ||
      nameLength > 425 && valueLength >= 120 ||
      nameLength > 450 && valueLength >= 90 ||
      nameLength > 475 && valueLength >= 60
    ) {
      console.log("e", nameLength, valueLength);
      // if (nameLength > 500) {
      //   ctx.font = "32px Regular";
      // } else if (nameLength > 450) {
      //   ctx.font = "36px Regular";
      // } else if (nameLength > 420) {
      //   ctx.font = "40px Regular";
      // } else {
      //   ctx.font = "45px Regular";
      // }
    }
    ctx.fillText(`${rank}. ${player.username}`, x, y);
  }
  
  ctx.font = "50px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "end";

  for (let i = 0; i < 12; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, valuePositions[0], start + spacing * i);
  }
  for (let i = 12; i < 24; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, valuePositions[1], start + spacing * (i-12));
  }
  for (let i = 24; i < 36; i++) {
    const player = lb.players[i];
    ctx.fillText(`${player.value}`, valuePositions[2], start + spacing * (i-24));
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
await createLeaderboardsCanvas("rpg16", "pbs");