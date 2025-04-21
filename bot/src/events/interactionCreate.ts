import { Client, Events, Interaction } from "discord.js";

export const interactionCreateEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: Client) {
		if (!interaction.isChatInputCommand()) {
      return;
    }
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`${interaction.commandName} does not exist`);
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      // if (interaction.replied || interaction.deferred) {
      //   await interaction.followUp({ 
      //     content: "there was an error while executing this command", 
      //     flags: MessageFlags.Ephemeral 
      //   });
      // } else {
      //   await interaction.reply({ 
      //     content: "there was an error while executing this command", 
      //     flags: MessageFlags.Ephemeral 
      //   });
      // }
    }
  }
};