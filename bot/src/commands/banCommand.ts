import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { Command } from "../types/Command";
import { callBans } from "../services/callServer";
import { isLbType, isMinigame, LbType, Minigame } from "@shared-types/types";

dotenv.config();

export const banCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban or unban a player")
    .addStringOption(option =>
      option.setName("player")
      .setDescription("enter a player")
      .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("lb")
      .setDescription("ban from a certain lb")
      .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const allowedIds = process.env.ALLOWED_IDS?.split(",") ?? [];
      if (!allowedIds.includes(interaction.user.id)) {
        await interaction.reply("You don't have permission to use this command");
        return;
      }

      let name = interaction.options.getString("player", true);
      const [realName, banType] = name.split(" ", 2);
      let ban: "ban" | "unban";
      if (banType && banType === "unban") {
        ban = "unban";
      } else {
        ban = "ban";
      }
      const lb = interaction.options.getString("lb");
      if (lb) {
        const [minigame, lbType] = lb.split(" ", 2);
        if (isMinigame(minigame) && isLbType(lbType)) {
          if (banType) {
            name = realName;
          }
          const response = await callBans(
            name, 
            ban, 
            minigame as Minigame, 
            lbType as LbType
          );
          if (response.success) {
            await interaction.reply(response.data);
          } else if (!response.success) {
            await interaction.reply(response.error.message);
          }
        } else {
          await interaction.reply("Invalid leaderboard");
        }
        return;
      }
      if (banType) {
        name = realName;
      }
      const response = await callBans(name, ban);
      if (response.success) {
        await interaction.reply(response.data);
      } else if (!response.success) {
        await interaction.reply(response.error.message);
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("There was an error while banning/unbanning the player");
    }
  }
};