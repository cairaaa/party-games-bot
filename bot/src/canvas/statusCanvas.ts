import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callStatus } from "../services/callServer";
import { colour } from "../types/colours";
import { StatusInterface } from "@shared-types/interfaces";
import { initializePlayerCanvas } from "../services/initializeCanvases";

function drawUsernameAndStatus(
  ctx: CanvasRenderingContext2D, 
  player: StatusInterface
): "Online" | "Offline" {
  ctx.font = "150px Bold";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 1280, 300);

  ctx.font = "100px Bold";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "right";
  ctx.fillText("Status:", 1280 - 25, 500);

  let status: "Online" | "Offline";
  if (player.lastLogin > player.lastLogout!) {
    status = "Online";
  } else {
    status = "Offline";
    ctx.fillStyle = colour.red;
  }

  ctx.font = "100px Regular";
  ctx.textAlign = "left";
  ctx.fillText(status, 1280 + 25, 500);
  return status;
}

function convertUnix(time: number): string {
  const date = new Date(time);
  const formatted = date.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  return formatted;
}

function center(
  ctx: CanvasRenderingContext2D, 
  title: string, 
  value: string, 
  y: number
): void {
  ctx.font = "100px Bold";
  const titleWidth = ctx.measureText(title).width;
  ctx.font = "100px Regular";
  const valueWidth = ctx.measureText(value).width;
  const width = titleWidth + valueWidth + 50;
  const startX = (2560 - width) / 2;

  ctx.font = "100px Bold";
  ctx.fillStyle = colour.lightGreen;
  ctx.fillText(title, startX, y);
  ctx.font = "100px Regular";
  ctx.fillStyle = colour.white;
  ctx.fillText(value, startX + titleWidth + 50, y);
}

function drawOnline(ctx: CanvasRenderingContext2D, player: StatusInterface): void {
  center(ctx, "Last Login:", convertUnix(player.lastLogin), 700);
  center(ctx, "Type:", player.gameType!, 850);
  center(ctx, "Mode:", player.mode!, 1000);
}

function drawOffline(ctx: CanvasRenderingContext2D, player: StatusInterface): void {
  center(ctx, "Last Login:", convertUnix(player.lastLogin), 700);
  center(ctx, "Last Logout:", convertUnix(player.lastLogout!), 850);
}

export async function createStatusCanvas(name: string): Promise<Buffer | string> {
  const response = await callStatus(name);
  if (!response.success) {
    return response.error.message;
  }
  const player = response.data;
  const canvas = await initializePlayerCanvas();
  const ctx = canvas.getContext("2d");
  const status = drawUsernameAndStatus(ctx, player);
  if (status === "Online") {
    drawOnline(ctx, player);
  } else if (status === "Offline") {
    drawOffline(ctx, player);
  }
  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}