import { REST, Routes } from "discord.js";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import { Command } from "../types/Command";

dotenv.config();

async function deployCommands(): Promise<void> {
  try {
    if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
      throw new Error("please add env variables");
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const commands: Command[] = [];
    const commandsPath = join(__dirname, "../commands");
    const commandFiles = (await fs.readdir(commandsPath))
      .filter(file => file.endsWith(".ts")|| file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const imported: Command = (await import(pathToFileURL(filePath).href));
        const command: Command = Object.values(imported)[0];
        commands.push(command);
      }
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    // for guild commands
    // await rest.put(
    //   Routes.applicationGuildCommands(
    //     process.env.CLIENT_ID, 
    //     process.env.GUILD_ID
    //   ),
    //   { body: commands.map(c => c.data) }
    // );
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands.map(c => c.data) }
    );
    console.log("done :)");
  } catch (error) {
    console.log(error);
  }
}

deployCommands();