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
  const columnPositions = [235, 988, 1742];
  const valuePositions = [835, 1585, 2335];
  const baseUsernameWidth = 350;
  const pixelsPerDigit = 30;
  ctx.fillStyle = colour.lightGreen;
  
  for (let i = 0; i < 36; i++) {
    const player = lb.players[i];
    const columnIndex = Math.floor(i / 12);
    const rowIndex = i % 12;
    const x = columnPositions[columnIndex];
    const y = start + spacing * rowIndex;
    const valueX = valuePositions[columnIndex];

    ctx.font = "50px Monospace";
    ctx.textAlign = "end";
    const rank = (columnIndex * 12) + rowIndex + 1;
    if (rank === 1) {
      ctx.fillStyle = colour.gold;
    } else if (rank === 2) {
      ctx.fillStyle = colour.silver;
    } else if (rank === 3) {
      ctx.fillStyle = colour.bronze;
    } else {
      ctx.fillStyle = colour.lightGreen;
    }
    ctx.fillText(`${rank}.`, x + 50, y);
    let value: string;
    if (lb.type === "pbs" &&
      (lb.minigame === "animalSlaughter" ||
      lb.minigame === "dive" ||
      lb.minigame === "highGround" ||
      lb.minigame === "hoeHoeHoe" || 
      lb.minigame === "lawnMoower" ||
      lb.minigame === "rpg16")
    ) {
      value = String(player.value);
    } else {
      value = String(player.value.toFixed(3));
    }
    const valueDigits = value.length;
    const valueWidth = valueDigits * pixelsPerDigit;
    const maxUsernameWidth = baseUsernameWidth + (150 - valueWidth);
    const adjustedUsernameWidth = Math.max(250, Math.min(450, maxUsernameWidth));

    ctx.fillStyle = colour.lightGreen;
    ctx.textAlign = "start";
    ctx.font = "50px Regular";
    
    const username = player.username;
    let nameWidth = ctx.measureText(username).width;
    if (nameWidth > adjustedUsernameWidth) {
      if (nameWidth > adjustedUsernameWidth * 1.5) {
        ctx.font = "32px Regular";
      } else if (nameWidth > adjustedUsernameWidth * 1.3) {
        ctx.font = "36px Regular";
      } else if (nameWidth > adjustedUsernameWidth * 1.1) {
        ctx.font = "40px Regular";
      } else {
        ctx.font = "45px Regular";
        console.log(username);
      }
      nameWidth = ctx.measureText(username).width;
    }
    ctx.fillText(username, x + 70, y);
    ctx.font = "50px Monospace";
    ctx.fillStyle = colour.white;
    ctx.textAlign = "end";
    ctx.fillText(`${value}`, valueX, y);
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
  return buffer;
};
