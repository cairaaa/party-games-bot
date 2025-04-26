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
    ctx.font = `${fontSize}px Montserrat-Bold`;
    const textWidth = ctx.measureText(player.username).width;
    if (textWidth <= 900) {
      break;
    }
    fontSize -= 5;
  } while (fontSize > 1);
  ctx.fillStyle = colour.white;
  ctx.font = `${fontSize}px Montserrat-Bold`;
  ctx.textAlign = "center";
  ctx.fillText(player.username, 590, 325);

  const centerX = 590;
  const winsText = "Wins:";
  const playerWins = String(player.stats.wins);

  ctx.font = "100px Montserrat-Bold";
  const winsTextWidth = ctx.measureText(winsText).width;

  ctx.font = "100px Monospace";
  const playerWinsWidth = ctx.measureText(playerWins).width;

  const totalWidth = winsTextWidth + playerWinsWidth + 50;
  const startX = centerX - (totalWidth / 2);

  ctx.font = "100px Montserrat-Bold";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "left";
  ctx.fillText(winsText, startX, 488);

  ctx.font = "100px Monospace";
  ctx.fillStyle = colour.white;
  ctx.fillText(playerWins, startX + winsTextWidth + 50, 488);

  ctx.font = "100px Montserrat-Bold";
  ctx.fillStyle = colour.green;
  ctx.textAlign = "center";
  ctx.fillText("Scores:", 590, 650);

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
  const scoreValueWidth = 900;
  const scoreSpacing = 125;
  const scoreStartY = 1400;

  ctx.font = "75px Montserrat-Bold";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "end";

  const reversedScoreNames = [...scoreNames].reverse();
  reversedScoreNames.forEach((scoreName, index) => {
    const height = scoreStartY - (index * scoreSpacing);
    ctx.fillText(scoreName, scoreWidthEnd, height);
  });

  ctx.font = "75px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "start";

  const reversedScoreValues = Object.values(scoreValues).reverse();
  Object.values(reversedScoreValues).forEach((scoreValue, index) => {
    const height = scoreStartY - (index * scoreSpacing);
    ctx.fillText(String(scoreValue), scoreValueWidth, height);
  });

  ctx.font = "100px Montserrat-Bold";
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
  const timeValueWidth = 2050;
  const timeSpacing = 125;
  const timeStartY = 1400;

  ctx.font = "75px Montserrat-Bold";
  ctx.fillStyle = colour.lightGreen;
  ctx.textAlign = "end";

  const reversedTimeNames = [...timeNames].reverse();
  reversedTimeNames.forEach((timeName, index) => {
    const height = timeStartY - (index * timeSpacing);
    ctx.fillText(timeName, timeWidthEnd, height);
  });

  ctx.font = "75px Monospace";
  ctx.fillStyle = colour.white;
  ctx.textAlign = "start";

  const reversedTimeValues = Object.values(timeValues).reverse();
  Object.values(reversedTimeValues).forEach((timeValue, index) => {
    const height = timeStartY - (index * timeSpacing);
    ctx.fillText(String(timeValue), timeValueWidth, height);
  });

  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}