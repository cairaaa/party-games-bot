import { Collection } from "discord.js";
import type { Command } from "./Command.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}