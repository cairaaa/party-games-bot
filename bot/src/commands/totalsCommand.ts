import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createTotalsCanvas } from "../canvas/totalsCanvas";

export const totalsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("totals")
    .setDescription("get total scores")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const imageBuffer = await createTotalsCanvas(name);
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(imageBuffer, { name: `${name}-totals.jpg` });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the player's total scores");
    }
  }
};