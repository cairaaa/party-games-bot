import { Request, Response } from "express";
import { getLeaderboardDatabase, sortLeaderboard } from "../services/getLeaderboards";
import { ApiResponse } from "../types";
import { LeaderboardInterface } from "../models/leaderboard";
import { minigamesArray, Minigame, lbTypesArray, LbType, isAscending } from "../types";

export const handleGetLeaderboard = async (
  req: Request,
  res: Response<ApiResponse<LeaderboardInterface>>
): Promise<void> => {
  try {
    const { minigame, lbType } = req.params;
    if (
      !minigamesArray.includes(minigame as Minigame) || 
      !lbTypesArray.includes(lbType as LbType)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: `The leaderboard ${minigame} ${lbType} was not found`,
          code: "INVALID_PARAMS"
        }
      });
      return;
    }
    const validMinigame = minigame as Minigame;
    const validLbType = lbType as LbType;
    const leaderboard = await getLeaderboardDatabase(validMinigame, validLbType);
    if (leaderboard.success) {
      let direction: "asc" | "desc" = "desc";
      if (isAscending(minigame as Minigame) && lbType === "pbs") {
        direction = "asc";
      }
      const sortedLeaderboard = sortLeaderboard(leaderboard.data, direction);
      res.status(200).json({
        success: true,
        data: sortedLeaderboard
      });
      return;
    }
    res.status(404).json({
      success: false,
      error: {
        message: `The leaderboard ${minigame} ${lbType} was not found`,
        code: "INVALID_PARAMS"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Unable to retrieve player leaderboards",
        code: "DATABASE_ERROR"
      }
    });
  }
};