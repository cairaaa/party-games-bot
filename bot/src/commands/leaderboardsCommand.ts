import { ChatInputCommandInteraction, SlashCommandBuilder, InteractionContextType } from "discord.js";
import { AutocompleteInteraction, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createLeaderboardsCanvas } from "../canvas/leaderboardsCanvas";
import { isLbType, isMinigame, LbType, Minigame } from "@shared-types/types";
import { leaderboardOptions } from "../types/leaderboardOptions";

export const leaderboardsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("get leaderboards")
    .addStringOption(option =>
      option.setName("leaderboard")
      .setDescription("enter a leaderboard")
      .setRequired(true)
      .setAutocomplete(true)
    )
    .setContexts(
      InteractionContextType.Guild, 
      InteractionContextType.BotDM, 
      InteractionContextType.PrivateChannel
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const response = interaction.options.getString("leaderboard", true);
      const [minigame, lbType] = response.split(" ", 2);
      if (!isMinigame(minigame) || !isLbType(lbType)) {
        await interaction.reply(`Couldn't find the ${response} leaderboard`);
        return;
      }
      const imageBuffer = await createLeaderboardsCanvas(
        minigame as Minigame, lbType as LbType
      );
      if (typeof imageBuffer === "string") {
        await interaction.reply(imageBuffer);
        return;
      }
      const attachment = new AttachmentBuilder(
        imageBuffer, 
        { name: `${minigame}-${lbType}.jpg` }
      );
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while getting the leaderboard");
    }
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused().toLowerCase();
    if (!focused) {
      const pbs = leaderboardOptions.slice(0, 15);
      await interaction.respond(
        pbs.map(choice => ({ name: choice.name, value: choice.value }))
      );
      return;
    }
    const filtered = leaderboardOptions.filter(
      choice => choice.name.toLowerCase().startsWith(focused)
    );
    await interaction.respond(
      filtered.map(choice => ({ name: choice.name, value: choice.value }))
    );
  }
};