import { Canvas, loadImage } from "@napi-rs/canvas";
import { fileURLToPath } from "url";
import path from "path";

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