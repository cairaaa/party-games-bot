import { CanvasRenderingContext2D } from "@napi-rs/canvas";
import { callRankings } from "../services/callServer";
import { colour } from "../types/colours";
import { RankingInterface } from "@shared-types/interfaces";
import { initializePlayerCanvas } from "../services/initializeCanvases";
import { leaderboardOptions } from "../types/leaderboardOptions";

function drawUsername(ctx: CanvasRenderingContext2D, player: RankingInterface): void {
  ctx.font = "150px Bold";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 1280, 300);
}

function drawSide(ctx: CanvasRenderingContext2D, player: RankingInterface): void {
  const startX = 150;
  const endX = 1330;
  const center = (endX - startX)/2;
  const startY = 455 + 12.5;
  const totalVerticalSpace = 1400 - 467.5;
  const blockCount = 4;
  const labelToValueGap = 100;
  const totalGapSpace = totalVerticalSpace - (blockCount * labelToValueGap);
  const blockSpacing = totalGapSpace / (blockCount - 1);
  const positions = {
    winsLabel: startY,
    winsValue: startY + 100,
    roundsLabel: startY + 100 + blockSpacing,
    roundsValue: startY + 100 + blockSpacing + 100,
    starsLabel: startY + (100 + blockSpacing) * 2,
    starsValue: startY + (100 + blockSpacing) * 2 + 100,
    avgLabel: startY + (100 + blockSpacing) * 3,
    avgValue: startY + (100 + blockSpacing) * 3 + 100
  };

  ctx.font = "75px Bold";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";
  
  ctx.fillText("Wins:", center, positions.winsLabel);
  ctx.fillText("Rounds:", center, positions.roundsLabel);
  ctx.fillText("Stars:", center, positions.starsLabel);
  ctx.fillText("Average Ranking:", center, positions.avgLabel);

  ctx.font = "75px Monospace";
  ctx.fillStyle = colour.white;

  let average = 0;
  player.rankings.forEach((ranking) => {
    if (ranking.place) {
      average += ranking.place;
    }
  });
  average = Math.round(average / 11);

  ctx.fillText(String(player.stats.wins), center, positions.winsValue);
  ctx.fillText(String(player.stats.rounds), center, positions.roundsValue);
  ctx.fillText(String(player.stats.stars), center, positions.starsValue);
  ctx.fillText(String(average), center, positions.avgValue);
}

function drawRankings(ctx: CanvasRenderingContext2D, player: RankingInterface): void {
  const reverseRankings = [...player.rankings].reverse();
  const startX = 1330;
  const startY = 1400;
  const spacingY = (1400 - 455) / 10;
  ctx.font = "50px Monospace";
  ctx.textAlign = "left";
  reverseRankings.forEach((ranking, index) => {
    if (ranking.place === 1) {
      ctx.fillStyle = colour.gold;
    } else if (ranking.place === 2) {
      ctx.fillStyle = colour.silver;
    } else if (ranking.place === 3) {
      ctx.fillStyle = colour.bronze;
    } else {
      ctx.fillStyle = colour.white;
    }
    if (!ranking.place) {
      ctx.fillText("N/A.", startX, startY - spacingY * index);
      return;
    }
    ctx.fillText(`${ranking.place}.`, startX, startY - spacingY * index);
  });

  const minigameX = 50 + startX + ctx.measureText(`${reverseRankings[0].place}`).width;
  ctx.font = "50px Regular";
  ctx.fillStyle = colour.lightGreen;
  reverseRankings.forEach((ranking, index) => {
    const minigameName = leaderboardOptions.find(
      option => option.value === `${ranking.minigame} pbs`
    );
    ctx.fillText(minigameName!.name, minigameX, startY - spacingY * index);
  });

  const endValuesX = 2410;
  ctx.font = "50px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "right";
  reverseRankings.forEach((ranking, index) => {
    ctx.fillText(`${ranking.value}`, endValuesX, startY - spacingY * index);
  });
}

export async function createRankingsCanvas(name: string): Promise<Buffer | string> {
  const response = await callRankings(name);
    if (!response.success) {
      return response.error.message;
    }
    const player = response.data;
    const canvas = await initializePlayerCanvas();
    const ctx = canvas.getContext("2d");
    drawUsername(ctx, player);
    drawSide(ctx, player);
    drawRankings(ctx, player);
    const buffer = canvas.toBuffer("image/jpeg");
    return buffer;
}