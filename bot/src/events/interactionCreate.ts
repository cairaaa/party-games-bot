import { Events, Interaction } from "discord.js";

export const interactionCreateEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction): Promise<void> {
    const client = interaction.client;
    if (!client.commands) {
      console.log("There are no commands initialized");
      return;
    }
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.log(`${interaction.commandName} does not exist`);
        return;
      }
      try {
        if (command.autocomplete) {
          await command.autocomplete(interaction);
        }
      } catch (error) {
        console.log("Error in autocomplete:", error);
      }
      return;
    }
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.log(`${interaction.commandName} does not exist`);
        return;
      }
      try {
        await command.execute(interaction);
      } catch (error) {
        console.log("Error executing command:", error);
      }
      return;
    }
  }
};