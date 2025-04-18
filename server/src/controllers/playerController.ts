import { Request, Response } from "express";
import { getPlayer } from "../api";
import { convertToPlayerModel, savePlayer } from "../services/savePlayer";
import { getPlayerDatabaseRecent } from "../services/getPlayer";
import { ApiResponse } from "../types";
import { PlayerInterface } from "../models/player";

export const handleGetPlayer = async (
  req: Request, 
  res: Response<ApiResponse<PlayerInterface>>
) => {
  const { name } = req.params;
  const checkDatabase = await getPlayerDatabaseRecent(name);
  if (checkDatabase.success) {
    res.status(200).json(checkDatabase);
    return;
  }
  if (!checkDatabase.success) {
    const apiResponse = await getPlayer(name);
    if (apiResponse.success) {
      res.status(200).json({ 
        success: true,
        data: convertToPlayerModel(apiResponse.data)
      });
      return;
    } else {
      if (apiResponse.error.code === "FORBIDDEN_RESPONSE") {
        res.status(403).json(apiResponse);
        return;
      } else if (apiResponse.error.code === "INVALID_PLAYER") {
        res.status(404).json(apiResponse);
        return;
      } else if (apiResponse.error.code === "RATE_LIMIT_EXCEEDED") {
        res.status(429).json(apiResponse);
        return;
      } else {
        res.status(500).json(apiResponse);
        return;
      }
    }
  }
};

// add save player later i think