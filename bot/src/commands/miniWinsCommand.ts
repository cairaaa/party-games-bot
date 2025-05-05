import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AttachmentBuilder, InteractionContextType } from "discord.js";
import { Command } from "../types/Command";
import { createMiniWinsCanvas } from "../canvas/miniWinsCanvas";

export const miniWinsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("mini")
    .setDescription("get minigame wins")
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
      const imageBuffer = await createMiniWinsCanvas(name);
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(imageBuffer, { name: `${name}-mini.jpg` });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the player's minigame wins");
    }
  }
};