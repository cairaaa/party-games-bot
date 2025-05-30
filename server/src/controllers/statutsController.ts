import { Request, Response } from "express";
import { getPlayer } from "../api";
import { getStatusDatabase } from "../services/getStatus";
import { convertToStatusModel, saveStatus } from "../services/saveStatus";
import { ApiResponse } from "@shared-types/types";
import { StatusInterface } from "../models/status";
import { convertToPlayerModel } from "../services/savePlayer";
import { savePlayer } from "../services/savePlayer";
import { saveLeaderboardAll } from "../services/saveLeaderboards";

export const handleGetStatus = async (
  req: Request, 
  res: Response<ApiResponse<StatusInterface>>
): Promise<void> => {
  try {
    const { name } = req.params;
    const checkDatabase = await getStatusDatabase(name);
    if (checkDatabase.success) {
      res.status(200).json({
        success: true,
        data: checkDatabase.data
      });
      return;
    }
    const playerData = await getPlayer(name);
    if (playerData.success) {
      const statusData = await convertToStatusModel(playerData.data);
      if (statusData.success) {
        res.status(200).json(statusData);
        await saveStatus(statusData.data);
        const savePlayerData = convertToPlayerModel(playerData.data);
        await savePlayer(savePlayerData);
        await saveLeaderboardAll(name);
        return;
      }
      if (statusData.error.code === "API_OFF") {
        res.status(403).json(statusData);
        return;
      } else if (statusData.error.code === "FORBIDDEN_RESPONSE") {
        res.status(403).json(statusData);
        return;
      } else if (statusData.error.code === "INVALID_PLAYER") {
        res.status(404).json(statusData);
        return;
      } else if (statusData.error.code === "RATE_LIMIT_EXCEEDED") {
        res.status(429).json(statusData);
        return;
      } else {
        res.status(500).json(statusData);
        return;
      }
    }
    if (playerData.error.code === "FORBIDDEN_RESPONSE") {
      res.status(403).json(playerData);
      return;
    } else if (playerData.error.code === "INVALID_PLAYER") {
      res.status(404).json(playerData);
      return;
    } else if (playerData.error.code === "RATE_LIMIT_EXCEEDED") {
      res.status(429).json(playerData);
      return;
    } else {
      res.status(500).json(playerData);
      return;
    }
  } catch {
    res.status(500).json({
      success: false,
      error: {
        message: "Unable to retrieve player status",
        code: "DATABASE_ERROR"
      }
    });
  }
};