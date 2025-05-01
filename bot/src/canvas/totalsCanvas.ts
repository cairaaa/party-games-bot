import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callPlayer } from "../services/callServer";
import { colour } from "../types/colours";
import { PlayerInterface } from "@shared-types/interfaces";
import { initializePlayerCanvas } from "../services/initializeCanvases";

function drawUsername(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  ctx.font = "150px Bold";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 1280, 300);
}

function drawGeneral(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  ctx.font = "100px Bold";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";

  const centerX = [526.5, 1280, 2033.5];
  const titlesY = 475;
  ctx.fillText("Wins:", centerX[0], titlesY);
  ctx.fillText("Rounds:", centerX[1], titlesY);
  ctx.fillText("Stars:", centerX[2], titlesY);

  ctx.font = "100px Monospace";
  ctx.fillStyle = colour.white;

  const valuesY = 615;
  ctx.fillText(String(player.stats.wins), centerX[0], valuesY);
  ctx.fillText(String(player.stats.rounds), centerX[1], valuesY);
  ctx.fillText(String(player.stats.stars), centerX[2], valuesY);
}

function drawTotals(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  const centerX = [526.5, 1280, 2033.5];
  const titleY = 1000;
  const valueY = 1125;
  const secondTitleY = 1275;
  const secondValueY = 1400;

  ctx.font = "100px Bold";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";
  ctx.fillText("Totals:", 1280, 850);

  ctx.font = "75px Bold";
  ctx.fillStyle = colour.lightGreen;

  ctx.fillText("Animal Slaughter:", centerX[0], titleY);
  ctx.fillText("Dive:", centerX[1], titleY);
  ctx.fillText("High Ground:", centerX[2], titleY);
  ctx.fillText("Hoe Hoe Hoe:", centerX[0], secondTitleY);
  ctx.fillText("Lawn Moower:", centerX[1], secondTitleY);
  ctx.fillText("Rpg-16:", centerX[2], secondTitleY);

  ctx.font = "75px Monospace";
  ctx.fillStyle = colour.white;

  ctx.fillText(String(player.stats.totals.animalSlaughterKills), centerX[0], valueY);
  ctx.fillText(String(player.stats.totals.diveScore), centerX[1], valueY);
  ctx.fillText(String(player.stats.totals.highGroundScore), centerX[2], valueY);
  ctx.fillText(String(player.stats.totals.hoeHoeHoeScore), centerX[0], secondValueY);
  ctx.fillText(String(player.stats.totals.lawnMoowerScore), centerX[1], secondValueY);
  ctx.fillText(String(player.stats.totals.rpg16Kills), centerX[2], secondValueY);
}

export async function createTotalsCanvas(name: string): Promise<Buffer | string> {
  const response = await callPlayer(name);
  if (!response.success) {
    return response.error.message;
  }
  const player = response.data;
  const canvas = await initializePlayerCanvas();
  const ctx = canvas.getContext("2d");
  drawUsername(ctx, player);
  drawGeneral(ctx, player);
  drawTotals(ctx, player);
  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}