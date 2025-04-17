import { LeaderboardModel, LeaderboardInterface } from "../models/leaderboard";
import { Minigame, LbType } from "../types/types";

export async function getLeaderboardDatabase(
  minigame: Minigame, 
  type: LbType
  ): Promise<LeaderboardInterface> {
  const leaderboard = await LeaderboardModel.findOne({ minigame, type });
  if (!leaderboard) {
    throw new Error(`couldnt find the ${type} ${minigame} leaderboard`);
  }
  return leaderboard;
}

export async function sortLeaderboard(
  lb: LeaderboardInterface, 
  order: "asc" | "desc" 
  ): Promise<LeaderboardInterface> {
  lb.players = lb.players
    .filter(p => p.value !== 0)
    .sort((a, b) => {
      if (order === "asc") {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });
  return lb;
}