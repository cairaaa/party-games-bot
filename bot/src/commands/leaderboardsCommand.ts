import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AutocompleteInteraction, AttachmentBuilder } from "discord.js";
import { Command } from "../types/Command";
import { createLeaderboardsCanvas } from "../canvas/leaderboardsCanvas";
import { LbType, Minigame } from "@shared-types/types";

const leaderboardOptions = [
  { name: "Anvil Spleef Best Time", value: "anvilSpleef pbs" },
  { name: "Bombardment Best Time", value: "bombardment pbs" },
  { name: "Chicken Rings Best Time", value: "chickenRings pbs" },
  { name: "Jigsaw Rush Best Time", value: "jigsawRush pbs" },
  { name: "Jungle Jump Best Time", value: "jungleJump pbs" },
  { name: "Lab Escape Best Time", value: "labEscape pbs" },
  { name: "Minecart Racing Best Time", value: "minecartRacing pbs" },
  { name: "Spider Maze Best Time", value: "spiderMaze pbs" },
  { name: "The Floor is Lava Best Time", value: "theFloorIsLava pbs" },
  { name: "Animal Slaughter Best Score", value: "animalSlaughter pbs" },
  { name: "Dive Best Score", value: "dive pbs" },
  { name: "High Ground Best Score", value: "highGround pbs" },
  { name: "Hoe Hoe Hoe Best Score", value: "hoeHoeHoe pbs" },
  { name: "Lawn Moower Best Score", value: "lawnMoower pbs" },
  { name: "Rpg-16 Best Score", value: "rpg16 pbs" },

  { name: "Animal Slaughter Wins", value: "animalSlaughter miniWins" },
  { name: "Anvil Spleef Wins", value: "anvilSpleef miniWins" },
  { name: "Avalanche Wins", value: "avalanche miniWins" },
  { name: "Bombardment Wins", value: "bombardment miniWins" },
  { name: "Cannon Painting Wins", value: "cannonPainting miniWins" },
  { name: "Chicken Rings Wins", value: "chickenRings miniWins" },
  { name: "Dive Wins", value: "dive miniWins" },
  { name: "Fire Leapers Wins", value: "fireLeapers miniWins" },
  { name: "Frozen Floor Wins", value: "frozenFloor miniWins" },
  { name: "High Ground Wins", value: "highGround miniWins" },
  { name: "Hoe Hoe Hoe Wins", value: "hoeHoeHoe miniWins" },
  { name: "Jigsaw Rush Wins", value: "jigsawRush miniWins" },
  { name: "Jungle Jump Wins", value: "jungleJump miniWins" },
  { name: "Lab Escape Wins", value: "labEscape miniWins" },
  { name: "Lawn Moower Wins", value: "lawnMoower miniWins" },
  { name: "Minecart Racing Wins", value: "minecartRacing miniWins" },
  { name: "Pig Fishing Wins", value: "pigFishing miniWins" },
  { name: "Pig Jousting Wins", value: "pigJousting miniWins" },
  { name: "Rpg-16 Wins", value: "rpg16 miniWins" },
  { name: "Shooting Range Wins", value: "shootingRange miniWins" },
  { name: "Spider Maze Wins", value: "spiderMaze miniWins" },
  { name: "Super Sheep Wins", value: "superSheep miniWins" },
  { name: "The Floor is Lava Wins", value: "theFloorIsLava miniWins" },
  { name: "Trampolinio Wins", value: "trampolinio miniWins" },
  { name: "Volcano Wins", value: "volcano miniWins" },
  { name: "Workshop Wins", value: "workshop miniWins" },

  { name: "Animal Slaughter Total Score", value: "animalSlaughter totals" },
  { name: "Dive Total Score", value: "dive totals" },
  { name: "High Ground Total Score", value: "highGround totals" },
  { name: "Hoe Hoe Hoe Total Score", value: "hoeHoeHoe totals" },
  { name: "Lawn Moower Total Score", value: "lawnMoower totals" },
  { name: "Rpg-16 Total Score", value: "rpg16 totals" }
];

export const leaderboardsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("get leaderboards")
    .addStringOption(option =>
      option.setName("leaderboard")
      .setDescription("enter a leaderboard")
      .setRequired(true)
      .setAutocomplete(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const response = interaction.options.getString("leaderboard", true);
      const [minigame, lbType] = response.split(" ", 2);
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