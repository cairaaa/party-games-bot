import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createPbCanvas } from "../canvas/pbCanvas";

export const pbCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pb")
    .setDescription("get pbs")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const imageBuffer = await createPbCanvas(name);
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(imageBuffer, { name: `${name}-pb.jpg` });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the player's pbs");
    }
  }
};