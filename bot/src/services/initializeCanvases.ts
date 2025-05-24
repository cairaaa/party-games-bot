import { Canvas, loadImage, Image } from "@napi-rs/canvas";
import { fileURLToPath } from "url";
import path from "path";
import { Minigame } from "@shared-types/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageCache = new Map<string, Image>();
const maxCache = 31;

async function getCachedImage(imagePath: string): Promise<Image> {
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath)!;
  }
  
  if (imageCache.size >= maxCache) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey) {
      imageCache.delete(firstKey);
      console.log(`removed oldest image from cache: ${firstKey}`);
    }
  }
  
  try {
    const image = await loadImage(imagePath);
    imageCache.set(imagePath, image);
    console.log(`loaded new image: ${path.basename(imagePath)} (Cache size: ${imageCache.size})`);
    return image;
  } catch (error) {
    console.error(`failed to load image: ${imagePath}`, error);
    throw error;
  }
}

let cacheCleanupInterval: NodeJS.Timeout;

function startCacheCleanup(): void {
  if (cacheCleanupInterval) return;
  
  cacheCleanupInterval = setInterval(() => {
    const cacheSize = imageCache.size;
    if (cacheSize > 0) {
      console.log(`[current image cache size: ${cacheSize} images`);
    }
  }, 1800000);
}

startCacheCleanup();

export async function initializePlayerCanvas(): Promise<Canvas> {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const imagePath = path.resolve(__dirname, `../../public/images-new/start-${randomNumber}.jpg`);
  
  try {
    const image = await getCachedImage(imagePath);
    const canvas = new Canvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    
    return canvas;
  } catch (error) {
    console.error("failed to initialize player canvas:", error);
    throw error;
  }
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
  
  try {
    const image = await getCachedImage(imagePath);
    const canvas = new Canvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    
    return canvas;
  } catch (error) {
    console.error("failed to initialize leaderboard canvas:", error);
    throw error;
  }
}