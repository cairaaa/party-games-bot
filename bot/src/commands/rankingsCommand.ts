import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createRankingsCanvas } from "../canvas/rankingsCanvas";

export const rankingsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("rankings")
    .setDescription("get rankings")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const imageBuffer = await createRankingsCanvas(name);
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(imageBuffer, { name: `${name}-rankings.jpg` });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the player's rankings");
    }
  }
};