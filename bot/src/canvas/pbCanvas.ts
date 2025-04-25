import { Canvas, loadImage } from "@napi-rs/canvas";
import { callPlayer } from "../services/callServer";
import { colour } from "../types/colours";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createPbCanvas(name: string): Promise<Buffer | string> {
  const response = await callPlayer(name);
  if (!response.success) {
    return response.error.message;
  }
  const player = response.data;

  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const imagePath = path.resolve(__dirname, `../../public/images-new/start-${randomNumber}.jpg`);
  const image = await loadImage(imagePath);
  const canvas = new Canvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  let fontSize = 150;
  do {
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(player.username).width;
    if (textWidth <= 900) {
      break;
    }
    fontSize -= 5;
  } while (fontSize > 1);
  ctx.fillStyle = colour.white;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 590, 300);

  ctx.font = "100px Arial";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "end";
  ctx.fillText("Wins:", 590, 488);

  ctx.fillStyle = colour.white;
  ctx.textAlign = "start";
  ctx.fillText(String(player.stats.wins), 640, 488);

  ctx.font = "100px Arial";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";
  ctx.fillText("Scores:", 590, 675);

  const scoreNames = [
    "Animal Slaughter:",
    "Dive:",
    "High Ground:",
    "Hoe Hoe Hoe:",
    "Lawn Moower:",
    "Rpg-16:"
  ];
  const scoreValues = {
    animalSlaughter: player.stats.pbs.animalSlaughterScore,
    dive: player.stats.pbs.diveScore,
    highGround: player.stats.pbs.highGroundScore,
    hoeHoeHoe: player.stats.pbs.hoeHoeHoeScore,
    lawnMoower: player.stats.pbs.lawnMoowerScore,
    rpg16: player.stats.pbs.rpg16Score
  };
  const scoreWidthEnd = 850;
  const scoreHeightStart = 825;
  const scoreHeightEnd = 1400;
  const scoreValueWidth = 900;
  const scoreSpacing = (scoreHeightEnd - scoreHeightStart) / 5;

  ctx.font = "75px Arial";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "end";
  
  scoreNames.forEach((scoreName, index) => {
    const height = scoreHeightStart + (index * scoreSpacing);
    ctx.fillText(scoreName, scoreWidthEnd, height);
  });

  ctx.fillStyle = colour.white;
  ctx.textAlign = "start";

  Object.values(scoreValues).forEach((scoreValue, index) => {
    const value = String(scoreValue);
    const height = scoreHeightStart + (index * scoreSpacing);
    ctx.fillText(value, scoreValueWidth, height);
  });

  ctx.font = "100px Arial";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";
  ctx.fillText("Times:", 1870, 250);

  const timeNames = [
    "Anvil Spleef:",
    "Bombardment:",
    "Chicken Rings:",
    "Jigsaw Rush:",
    "Jungle Jump:",
    "Lab Escape:",
    "Minecart Racing:",
    "Spider Maze",
    "The Floor is Lava:"
  ];
  const timeValues = {
    anvilSpleef: player.stats.pbs.anvilSpleefTime,
    bombardment: player.stats.pbs.bombardmentTime,
    chickenRings: player.stats.pbs.chickenRingsTime,
    jigsawRush: player.stats.pbs.jigsawRushTime,
    jungleJump: player.stats.pbs.jungleJumpTime,
    labEscape: player.stats.pbs.labEscapeTime,
    minecartRacing: player.stats.pbs.minecartRacingTime,
    spiderMaze: player.stats.pbs.spiderMazeTime,
    theFloorIsLava: player.stats.pbs.theFloorIsLavaTime
  };
  const timeWidthEnd = 2000;
  const timeHeightStart = 400;
  const timeHeightEnd = 1400;
  const timeValueWidth = 2050;
  const timeSpacing = (timeHeightEnd - timeHeightStart) / 8;

  ctx.font = "75px Arial";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "end";

  timeNames.forEach((timeName, index) => {
    const height = timeHeightStart + (index * timeSpacing);
    ctx.fillText(timeName, timeWidthEnd, height);
  });

  ctx.fillStyle = colour.white;
  ctx.textAlign = "start";

  Object.values(timeValues).forEach((timeValue, index) => {
    const value = String(timeValue);
    const height = timeHeightStart + (index * timeSpacing);
    ctx.fillText(value, timeValueWidth, height);
  });

  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}