import { Request, Response } from "express";
import { banLeaderboardsAll, banLeaderboardOne } from "../services/banPlayerLeaderboard";
import { unbanLeaderboardsAll, unbanLeaderboardOne } from "../services/banPlayerLeaderboard";
import { ApiResponse } from "@shared-types/types";
import { getPlayerDatabase } from "../services/getPlayer";
import { minigamesArray, Minigame, lbTypesArray, LbType } from "@shared-types/types";

const handleBanUnbanPlayer = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  action: "ban" | "unban"
): Promise<void> => {
  try {
    const { name } = req.params;
    const inDatabase = await getPlayerDatabase(name);
    if (!inDatabase.success && inDatabase.error.code === "INVALID_PLAYER") {
      res.status(404).json(inDatabase);
      return;
    } else if (!inDatabase.success) {
      res.status(500).json(inDatabase);
      return;
    }
    if (action === "ban") {
      await banLeaderboardsAll(name);
    } else if (action === "unban") {
      await unbanLeaderboardsAll(name);
    }
    res.status(200).json({
      success: true,
      data: null
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "There was an error while banning the player from all leaderboards",
        code: "DATABASE_ERROR"
      }
    });
  }
};

export const banPlayer = (
  req: Request, 
  res: Response<ApiResponse<null>>
): Promise<void> => {
  return handleBanUnbanPlayer(req, res, "ban");
};

export const unbanPlayer = (
  req: Request, 
  res: Response<ApiResponse<null>>
): Promise<void> => {
  return handleBanUnbanPlayer(req, res, "unban");
};

const handleBanUnbanPlayerOne = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  action: "ban" | "unban"
): Promise<void> => {
  try {
    const { name, minigame, lbType } = req.params;
    const inDatabase = await getPlayerDatabase(name);
    if (!inDatabase.success && inDatabase.error.code === "INVALID_PLAYER") {
      res.status(404).json(inDatabase);
      return;
    } else if (!inDatabase.success) {
      res.status(500).json(inDatabase);
      return;
    }
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
    if (action === "ban") {
      await banLeaderboardOne(name, minigame as Minigame, lbType as LbType);
    } else if (action === "unban") {
      await unbanLeaderboardOne(name, minigame as Minigame, lbType as LbType);
    }
    res.status(200).json({
      success: true,
      data: null
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        message: "There was an error while banning the player from one leaderboard",
        code: "DATABASE_ERROR"
      }
    });
  }
};

export const banPlayerOne = (
  req: Request, 
  res: Response<ApiResponse<null>>
): Promise<void> => {
  return handleBanUnbanPlayerOne(req, res, "ban");
};

export const unbanPlayerOne = (
  req: Request, 
  res: Response<ApiResponse<null>>
): Promise<void> => {
  return handleBanUnbanPlayerOne(req, res, "unban");
};