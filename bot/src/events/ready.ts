import { Client, Events } from "discord.js";

export const clientReadyEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client): void {
    if (client.user) {
      console.log(`bot is online as ${client.user.tag}!`);
    } else {
      console.log("there was an error connecting :(");
    }
  }
};