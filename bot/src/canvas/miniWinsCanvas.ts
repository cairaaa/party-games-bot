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

  ctx.font = "55px Bold";
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
      "Animal Slaughter:",
      "Anvil Spleef:",
      "Avalanche:",
      "Bombardment:",
      "Cannon Painting:",
      "Chicken Rings:",
      "Dive:",
      "Fire Leapers:",
      "Frozen Floor:",
      "High Ground:"
    ],
    columnValues: {
      animalSlaughter: player.stats.miniWins.animalSlaughter,
      anvilSpleef: player.stats.miniWins.anvilSpleef,
      avalanche: player.stats.miniWins.avalanche,
      bombardment: player.stats.miniWins.bombardment,
      cannonPainting: player.stats.miniWins.cannonPainting,
      chickenRings: player.stats.miniWins.chickenRings,
      dive: player.stats.miniWins.dive,
      fireLeapers: player.stats.miniWins.fireLeapers,
      frozenFloor: player.stats.miniWins.frozenFloor,
      highGround: player.stats.miniWins.highGround
    },
    startX: 150,
    endX: 903,
    startY: 1400
  });
}

function drawSecondColumn(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  drawColumn(ctx, player, {
    columnNames: [
      "Hoe Hoe Hoe:",
      "Jigsaw Rush:",
      "Jungle Jump:",
      "Lab Escape:",
      "Lawn Moower:",
      "Minecart Racing:",
      "Pig Fishing:",
      "Pig Jousting:",
      "Rpg-16:",
      "Shooting Range:"
    ],
    columnValues: {
      hoeHoeHoe: player.stats.miniWins.hoeHoeHoe,
      jigsawRush: player.stats.miniWins.jigsawRush,
      jungleJump: player.stats.miniWins.jungleJump,
      labEscape: player.stats.miniWins.labEscape,
      lawnMoower: player.stats.miniWins.lawnMoower,
      minecartRacing: player.stats.miniWins.minecartRacing,
      pigFishing: player.stats.miniWins.pigFishing,
      pigJousting: player.stats.miniWins.pigJousting,
      rpg16: player.stats.miniWins.rpg16,
      shootingRange: player.stats.miniWins.shootingRange
    },
    startX: 903,
    endX: 1657,
    startY: 1400
  });
}

function drawThirdColumn(ctx: CanvasRenderingContext2D, player: PlayerInterface): void {
  drawColumn(ctx, player, {
    columnNames: [
      "Spider Maze:",
      "Super Sheep:",
      "The Floor is Lava:",
      "Trampolinio:",
      "Volcano:",
      "Workshop"
    ],
    columnValues: {
      spiderMaze: player.stats.miniWins.spiderMaze,
      superSheep: player.stats.miniWins.superSheep,
      theFloorIsLava: player.stats.miniWins.theFloorIsLava,
      trampolinio: player.stats.miniWins.trampolinio,
      volcano: player.stats.miniWins.volcano,
      workshop: player.stats.miniWins.workshop
    },
    startX: 1657,
    endX: 2410,
    startY: 980
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
  drawUsername(ctx, player);
  drawFirstColumn(ctx, player);
  drawSecondColumn(ctx, player);
  drawThirdColumn(ctx, player);
  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}