import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callPlayer } from "../services/callServer";
import { colour } from "../types/colours";
import { PlayerInterface } from "@shared-types/interfaces";
import { initializePlayerCanvas } from "../services/initializeCanvases";

function drawUsernameAndWins(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  ctx.font = "150px Bold";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 1280, 300);

  ctx.font = "100px Bold";
  ctx.fillStyle = colour.green;
  ctx.fillText("Wins:", 526.5, 550);

  ctx.font = "100px Monospace";
  ctx.fillStyle = colour.white;
  ctx.fillText(String(player.stats.wins), 526.5, 690);
}

function drawColumn(
  ctx: CanvasRenderingContext2D,
  _player: PlayerInterface,
  options: {
    columnNames: string[],
    columnValues: Record<string, number>,
    startX: number,
    endX: number,
    startY: number,
    spacingY?: number
  }
): void {
  const { columnNames, columnValues, startX, endX, startY } = options;
  const spacingY = options.spacingY || 105;
  const spacingX = 25;

  ctx.font = "55px Regular";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "start";

  const reversedColumnNames = [...columnNames].reverse();
  reversedColumnNames.forEach((columnName, index) => {
    const height = startY - (index * spacingY);
    ctx.fillText(columnName, startX + spacingX, height);
  });
    
  ctx.font = "55px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "end";

  const valueArray = Object.values(columnValues);
  const reversedColumnValues = valueArray.reverse();
  reversedColumnValues.forEach((scoreValue, index) => {
    const height = startY - (index * spacingY);
    ctx.fillText(String(scoreValue), endX - spacingX, height);
  });
}

function drawFirstColumn(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  drawColumn(ctx, player, {
    columnNames: [
      "Frozen Floor:",
      "Jigsaw Rush:",
      "Lawn Moower:",
      "Pig Jousting:",
      "Spider Maze:",
      "Trampolinio:"
    ],
    columnValues: {
      frozenFloor: player.stats.miniWins.frozenFloor,
      jigsawRush: player.stats.miniWins.jigsawRush,
      lawnMoower: player.stats.miniWins.lawnMoower,
      pigJousting: player.stats.miniWins.pigJousting,
      spiderMaze: player.stats.miniWins.spiderMaze,
      trampolinio: player.stats.miniWins.trampolinio
    },
    startX: 150,
    endX: 903,
    startY: 1400
  });
}

function drawSecondColumn(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  drawColumn(ctx, player, {
    columnNames: [
      "Animal Slaughter:",
      "Avalanche:",
      "Cannon Painting",
      "Dive:",
      "High Ground:",
      "Jungle Jump:",
      "Minecart Racing:",
      "Rpg-16:",
      "Super Sheep:",
      "Volcano:"
    ],
    columnValues: {
      animalSlaughter: player.stats.miniWins.animalSlaughter,
      avalanche: player.stats.miniWins.avalanche,
      cannonPainting: player.stats.miniWins.cannonPainting,
      dive: player.stats.miniWins.dive,
      highGround: player.stats.miniWins.highGround,
      jungleJump: player.stats.miniWins.jungleJump,
      minecartRacing: player.stats.miniWins.minecartRacing,
      rpg16: player.stats.miniWins.rpg16,
      superSheep: player.stats.miniWins.superSheep,
      volcano: player.stats.miniWins.volcano
    },
    startX: 903,
    endX: 1657,
    startY: 1400
  });
}

function drawThirdColumn(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  drawColumn(ctx, player, {
    columnNames: [
      "Anvil Spleef:",
      "Bombardment:",
      "Chicken Rings:",
      "Fire Leapers:",
      "Hoe Hoe Hoe:",
      "Lab Escape:",
      "Pig Fishing:",
      "Shooting Range:",
      "The Floor is Lava:",
      "Workshop:"
    ],
    columnValues: {
      anvilSpleef: player.stats.miniWins.anvilSpleef,
      bombardment: player.stats.miniWins.bombardment,
      chickenRings: player.stats.miniWins.chickenRings,
      fireLeapers: player.stats.miniWins.fireLeapers,
      hoeHoeHoe: player.stats.miniWins.hoeHoeHoe,
      labEscape: player.stats.miniWins.labEscape,
      pigFishing: player.stats.miniWins.pigFishing,
      shootingRange: player.stats.miniWins.shootingRange,
      theFloorIsLava: player.stats.miniWins.theFloorIsLava,
      workshop: player.stats.miniWins.workshop
    },
    startX: 1657,
    endX: 2410,
    startY: 1400
  });
}

export async function createMiniWinsCanvas(name: string): Promise<Buffer | string> {
  const response = await callPlayer(name);
  if (!response.success) {
    return response.error.message;
  }
  const player = response.data;
  const canvas = await initializePlayerCanvas();
  const ctx = canvas.getContext("2d");
  drawUsernameAndWins(ctx, player);
  drawFirstColumn(ctx, player);
  drawSecondColumn(ctx, player);
  drawThirdColumn(ctx, player);
  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}