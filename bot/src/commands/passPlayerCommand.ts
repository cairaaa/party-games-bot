import { ChatInputCommandInteraction, SlashCommandBuilder, InteractionContextType } from "discord.js";
import { Command } from "../types/Command";
import { getPass } from "../services/passPlayer";

export const passPlayersCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pass")
    .setDescription("get how far you are from passing someone")
    .addStringOption(option =>
      option.setName("players")
      .setDescription("enter players")
      .setRequired(true)
    )
    .setContexts(
      InteractionContextType.Guild, 
      InteractionContextType.BotDM, 
      InteractionContextType.PrivateChannel
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const names = interaction.options.getString("players", true);
      const response = await getPass(names);
      await interaction.reply(response);
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the stats");
    }
  }
};