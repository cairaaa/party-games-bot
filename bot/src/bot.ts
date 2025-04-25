import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { Command } from "./types/Command";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
  file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const imported = await import(filePath);
  const command: Command = imported.default || Object.values(imported)[0];
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = (fs.readdirSync(eventsPath)).filter(file => 
  file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = (await import(filePath)).default || Object.values(await import(filePath))[0];
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(BOT_TOKEN);