import { PlayerModel } from "../models/player";
import { LeaderboardModel } from "../models/leaderboard";
import { LbType, Minigame } from "@shared-types/types";

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
      throw new Error("the function savePlayer has to be called recently before storing lbs");
    }
    const leaderboards = await LeaderboardModel.find({});
    const bulkOps = leaderboards.map(lb => {
      const lbType = lb.type as LbType;
      const lbMinigame = lb.minigame as Minigame;
      const statKey = statsMap[lbType][lbMinigame];
      if (!statKey) {
        console.log(`Missing stat mapping for ${lbType}.${lbMinigame}`);
        return;
      }
      const statsCategory = player.stats[lbType];
      if (!statsCategory) {
        console.log(`Player ${name} missing stat category ${lbType}`);
        return;
      }
      const value = statsCategory[statKey as keyof typeof statsCategory];
      const playerExists = lb.players.some(p => 
        p._id === player._id
      );
      if (playerExists) {
        return {
          updateOne: {
            filter: { 
              _id: lb._id, 
              "players._id": player._id 
            },
            update: { 
              $set: { 
                "players.$.username": player.username,
                "players.$.value": value
              } 
            }
          }
        };
      } else {
        return {
          updateOne: {
            filter: { _id: lb._id },
            update: { 
              $push: { 
                players: {
                  _id: player._id,
                  username: player.username,
                  value: value
                }
              } 
            }
          }
        };
      }
    }).filter((op): op is NonNullable<typeof op> => op !== null);
    if (bulkOps.length > 0) {
      await LeaderboardModel.bulkWrite(bulkOps);
    }
    // erm not ai at all!!
  } catch (error) {
    console.log("there was an error saving the player's lb data to the database");
    throw error;
  }
}