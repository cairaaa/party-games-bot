import { ChatInputCommandInteraction, SlashCommandBuilder, InteractionContextType } from "discord.js";
import { Command } from "../types/Command";
import { getMilestone } from "../services/getMilestone";

export const passPlayersCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("milestone")
    .setDescription("get how far you are from the next milestone")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    )
    .setContexts(
      InteractionContextType.Guild, 
      InteractionContextType.BotDM, 
      InteractionContextType.PrivateChannel
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const response = await getMilestone(name);
      await interaction.reply(response);
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the stats");
    }
  }
};