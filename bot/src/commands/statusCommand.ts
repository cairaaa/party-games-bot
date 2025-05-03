import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createStatusCanvas } from "../canvas/statusCanvas";

export const statusCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("get statuses")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const imageBuffer = await createStatusCanvas(name);
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(imageBuffer, { name: `${name}-status.jpg` });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the player's status");
    }
  }
};