import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command";

export const leafeonCommand: Command = {
  data: new SlashCommandBuilder()
   .setName("leafeon")
   .setDescription("replies with leafeon, a test command"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("leafeon");
  }
};