import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}