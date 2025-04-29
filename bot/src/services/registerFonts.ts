import { GlobalFonts } from "@napi-rs/canvas";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerFonts(): void {
  const montserratBoldPath = path.resolve(__dirname, "../../public/fonts/Montserrat-Bold.ttf");
  GlobalFonts.registerFromPath(montserratBoldPath, "Bold");
  const montserratPath = path.resolve(__dirname, "../../public/fonts/Montserrat-Medium.ttf");
  GlobalFonts.registerFromPath(montserratPath, "Regular");
  const monospacePath = path.resolve(__dirname, "../../public/fonts/AurulentSansMono-Regular.otf");
  GlobalFonts.registerFromPath(monospacePath, "Monospace");
}