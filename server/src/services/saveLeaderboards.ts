import { PlayerModel } from "../models/player";
import { LeaderboardPlayerInterface, LeaderboardModel } from "../models/leaderboard";
import { LbType, Minigame } from "../types";

const statsMap: Record<LbType, Partial<Record<Minigame, string>>> = {
  pbs: {
    anvilSpleef: "anvilSpleefTime",
    bombardment: "bombardmentTime",
    chickenRings: "chickenRingsTime",
    jigsawRush: "jigsawRushTime",
    jungleJump: "jungleJumpTime",
    labEscape: "labEscapeTime",
    minecartRacing: "minecartRacingTime",
    spiderMaze: "spiderMazeTime",
    theFloorIsLava: "theFloorIsLavaTime",
    animalSlaughter: "animalSlaughterScore",
    dive: "diveScore",
    highGround: "highGroundScore",
    hoeHoeHoe: "hoeHoeHoeScore",
    lawnMoower: "lawnMoowerScore",
    rpg16: "rpg16Score"
  },
  miniWins: {
    animalSlaughter: "animalSlaughter",
    anvilSpleef: "anvilSpleef",
    avalanche: "avalanche",
    bombardment: "bombardment",
    cannonPainting: "cannonPainting",
    chickenRings: "chickenRings",
    dive: "dive",
    fireLeapers: "fireLeapers",
    frozenFloor: "frozenFloor",
    highGround: "highGround",
    hoeHoeHoe: "hoeHoeHoe",
    jigsawRush: "jigsawRush",
    jungleJump: "jungleJump",
    labEscape: "labEscape",
    lawnMoower: "lawnMoower",
    minecartRacing: "minecartRacing",
    pigFishing: "pigFishing",
    pigJousting: "pigJousting",
    rpg16: "rpg16",
    shootingRange: "shootingRange",
    spiderMaze: "spiderMaze",
    superSheep: "superSheep",
    theFloorIsLava: "theFloorIsLava",
    trampolinio: "trampolinio",
    volcano: "volcano",
    workshop: "workshop"
  },
  totals: {
    animalSlaughter: "animalSlaughterKills",
    dive: "diveScore",
    highGround: "highGroundScore",
    hoeHoeHoe: "hoeHoeHoeScore",
    lawnMoower: "lawnMoowerScore",
    rpg16: "rpg16Kills"
  }
};

export async function saveLeaderboardAll(name: string): Promise<void> {
  try {
    const player = await PlayerModel.findOne(
      { username: name },
      null,
      { collation: { locale: "en", strength: 2 } }
    );
    if (!player) {
      throw new Error("player could not be found in the database, please add the player first");
    }

    const now = new Date();
    const updatedAt = player.updatedAt;
    const time = now.getTime() - updatedAt!.getTime();
    if (time > 5000) {
      throw new Error("the function getPlayer has to be called recently before storing lbs");
    }

    const leaderboards = await LeaderboardModel.find({});
    for (const lb of leaderboards) {
      // my best attempt to avoid typescript any errors...
      const lbType = lb.type as LbType;
      const lbMinigame = lb.minigame as Minigame;
      const statKey = statsMap[lbType][lbMinigame];
      if (!statKey) {
        throw new Error(`couldn't find ${lbType}.${lbMinigame}`);
      }
      const statsCategory = player.stats[lbType];
      if (!statsCategory) {
        throw new Error(`couldn't find the category ${lbType}`);
      }
      const value = statsCategory[statKey as keyof typeof statsCategory];

      const existing = lb.players.find((p: LeaderboardPlayerInterface) => p._id === player._id);
      if (existing) {
        existing.username = player.username;
        existing.value = value;
      } else {
        const leaderboardPlayer = {
          _id: player._id,
          username: player.username,
          value: value
        };
        lb.players.push(leaderboardPlayer);
      }
      await lb.save();
    }
  } catch (error) {
    console.log("couldn't store leaderboard values in database");
    throw error;
  }
}
