import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AttachmentBuilder, InteractionContextType } from "discord.js";
import { Command } from "../types/Command";
import { createPbsCanvas } from "../canvas/pbCanvas";

export const pbsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pb")
    .setDescription("get pbs")
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
      const imageBuffer = await createPbsCanvas(name);
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