import { LeaderboardInterface, LeaderboardModel } from "../models/leaderboard";
import { Minigame } from "../types/types";

interface RankingInterface {
  _id: string;
  username: string;
  rankings: RankingMinigameInterface[];
}

interface RankingMinigameInterface {
  minigame: Minigame;
  place: number | null;
  value: number | null;
}

function isAscending(minigame: Minigame): boolean {
  const minigames: Minigame[] = [
    "chickenRings",
    "jigsawRush",
    "jungleJump",
    "labEscape",
    "minecartRacing",
    "spiderMaze",
    "theFloorIsLava"
  ];
  return minigames.includes(minigame);
}

export async function getRankings(name: string): Promise<RankingInterface> {
  try {
    const leaderboards = await LeaderboardModel.find({ type: "pbs" });
    const rankings: RankingMinigameInterface[] = [];
    const lowerUsername = name.toLowerCase();
    let realUsername: string | undefined;
    let uuid: string | undefined;

    for (const lb of leaderboards) {
      const player = lb.players.find(
        p => p.username.toLowerCase() === lowerUsername
      );
      if (!player) {
        rankings.push({
          minigame: lb.minigame,
          place: null,
          value: null
        });
        continue;
      }
      if (!realUsername) {
        realUsername = player.username;
      }
      if (!uuid) {
        uuid = player._id;
      }
      if (player.banned) {
        rankings.push({
          minigame: lb.minigame,
          place: null,
          value: player.value
        });
        continue;
      }
      const validPlayers = [];
      for (const p of lb.players) {
        if (p.value !== 0 && !p.banned) {
          validPlayers.push(p);
        }
      }
      validPlayers.sort((a, b) => {
        if (isAscending(lb.minigame)) {
          return a.value - b.value;
        } else {
          return b.value - a.value;
        }
      });
      const place = validPlayers.findIndex(p => p._id === player._id) + 1;
      rankings.push({
        minigame: lb.minigame,
        place: place,
        value: player.value
      });
    }
    if (!uuid || !realUsername) {
      throw new Error("rror in getting the player's uuid/username, likely doesn't exist");
    }
    rankings.sort((a, b) => {
      if (a.place === null) {
        return 1;
      } else if (b.place === null) {
        return -1;
      } else {
        return a.place - b.place;
      }
    });
    return {
      _id: uuid,
      username: realUsername,
      rankings: rankings
    };
  } catch (error) {
    console.error("Error getting player rankings:", error);
    throw error;
  }
}
