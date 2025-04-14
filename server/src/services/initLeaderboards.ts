import { LeaderboardModel } from "../models/leaderboard"; 

// only run this script once to set up lbs!!!

const leaderboards = [
  ["anvilSpleef", "pbs"],
  ["bombardment", "pbs"],
  ["chickenRings", "pbs"],
  ["jigsawRush", "pbs"],
  ["jungleJump", "pbs"],
  ["labEscape", "pbs"],
  ["minecartRacing", "pbs"],
  ["spiderMaze", "pbs"],
  ["theFloorIsLava", "pbs"],
  ["animalSlaughter", "pbs"],
  ["dive", "pbs"],
  ["highGround", "pbs"],
  ["hoeHoeHoe", "pbs"],
  ["lawnMoower", "pbs"],
  ["rpg16", "pbs"],

  ["animalSlaughter", "miniWins"],
  ["anvilSpleef", "miniWins"],
  ["avalanche", "miniWins"],
  ["bombardment", "miniWins"],
  ["cannonPainting", "miniWins"],
  ["chickenRings", "miniWins"],
  ["dive", "miniWins"],
  ["fireLeapers", "miniWins"],
  ["frozenFloor", "miniWins"],
  ["highGround", "miniWins"],
  ["hoeHoeHoe", "miniWins"],
  ["jigsawRush", "miniWins"],
  ["jungleJump", "miniWins"],
  ["labEscape", "miniWins"],
  ["lawnMoower", "miniWins"],
  ["minecartRacing", "miniWins"],
  ["pigFishing", "miniWins"],
  ["pigJousting", "miniWins"],
  ["rpg16", "miniWins"],
  ["shootingRange", "miniWins"],
  ["spiderMaze", "miniWins"],
  ["superSheep", "miniWins"],
  ["theFloorIsLava", "miniWins"],
  ["trampolinio", "miniWins"],
  ["volcano", "miniWins"],
  ["workshop", "miniWins"],

  ["animalSlaughter", "totals"],
  ["dive", "totals"],
  ["highGround", "totals"],
  ["hoeHoeHoe", "totals"],
  ["lawnMoower", "totals"],
  ["rpg16", "totals"]
] as const;

async function initializeLeaderboards() {
  for (const lb of leaderboards) {
    const minigame = lb[0];
    const lbType = lb[1];
    const existing = await LeaderboardModel.findOne({
      minigame: minigame,
      type: lbType
    });
    if (!existing) {
      const leaderboard = new LeaderboardModel({
        minigame: minigame,
        type: lbType,
        players: [],
      });
      await leaderboard.save();
    }
  }
}

// await connectToDatabase();
// await initializeLeaderboards();
// process.exit(0);