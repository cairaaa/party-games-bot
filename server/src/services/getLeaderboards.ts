import { LeaderboardModel, LeaderboardInterface } from "../models/leaderboard";
import { Minigame, LbType } from "@shared-types/types";
import { ApiResponse } from "@shared-types/types";

export async function getLeaderboardDatabase(
  minigame: Minigame, 
  type: LbType
): Promise<ApiResponse<LeaderboardInterface>> {
  try {
    const leaderboard = await LeaderboardModel.findOne({ minigame, type });
    if (!leaderboard) {
      throw new Error(`couldnt find the ${type} ${minigame} leaderboard`);
    }
    return {
      success: true,
      data: leaderboard
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "There was an error getting the leaderboard from the database",
        code: "DATABASE_ERROR"
      }
    };
  }
}

export function sortLeaderboard(
  lb: LeaderboardInterface, 
  order: "asc" | "desc" 
): LeaderboardInterface {
  lb.players = lb.players
    .filter(p => p.value !== 0 && p.banned !== true)
    .sort((a, b) => {
      if (order === "asc") {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });
  return lb;
}