import { Canvas, loadImage } from "@napi-rs/canvas";
import { fileURLToPath } from "url";
import path from "path";
import { Minigame } from "@shared-types/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializePlayerCanvas(): Promise<Canvas> {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const imagePath = path.resolve(__dirname, `../../public/images-new/start-${randomNumber}.jpg`);
  const image = await loadImage(imagePath);
  const canvas = new Canvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}

const minigamesMap = {
  animalSlaughter: "animal-slaughter",
  anvilSpleef: "anvil-spleef",
  avalanche: "avalanche",
  bombardment: "bombardment",
  cannonPainting: "cannon-painting",
  chickenRings: "chicken-rings",
  dive: "dive",
  fireLeapers: "fire-leapers",
  frozenFloor: "frozen-floor",
  highGround: "high-ground",
  hoeHoeHoe: "hoe-hoe-hoe",
  jigsawRush: "jigsaw-rush",
  jungleJump: "jungle-jump",
  labEscape: "lab-escape",
  lawnMoower: "lawn-moower",
  minecartRacing: "minecart-racing",
  pigFishing: "pig-fishing",
  pigJousting: "pig-jousting",
  rpg16: "rpg-16",
  shootingRange: "shooting-range",
  spiderMaze: "spider-maze",
  superSheep: "super-sheep",
  theFloorIsLava: "the-floor-is-lava",
  trampolinio: "trampolinio",
  volcano: "volcano",
  workshop: "workshop"
};

export async function initializeLeaderboardCanvas(minigame: Minigame): Promise<Canvas> {
  const minigameImage = minigamesMap[minigame];
  const imagePath = path.resolve(__dirname, `../../public/images-new/${minigameImage}.jpg`);
  const image = await loadImage(imagePath);
  const canvas = new Canvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}