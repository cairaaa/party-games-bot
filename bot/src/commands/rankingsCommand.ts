import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AttachmentBuilder, InteractionContextType } from "discord.js";
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
    )
    .setContexts(
      InteractionContextType.Guild, 
      InteractionContextType.BotDM, 
      InteractionContextType.PrivateChannel
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("player", true);
      const [realName, all] = name.split(" ", 2);
      let imageBuffer: Buffer | string;
      if (all === "all") {
        imageBuffer = await createRankingsCanvas(realName, true);
      } else {
        imageBuffer = await createRankingsCanvas(name);
      }
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