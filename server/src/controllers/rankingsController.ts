import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { getRankings, getRealRankings, RankingInterface } from "../services/getRankings";
import { getPlayer } from "../api";
import { convertToPlayerModel, savePlayer } from "../services/savePlayer";
import { saveLeaderboardAll } from "../services/saveLeaderboards";
import { getPlayerDatabase, getPlayerDatabaseRecent } from "../services/getPlayer";

const handleGetRankings = async (
  req: Request, 
  res: Response<ApiResponse<RankingInterface>>,
  useFilter: boolean = true
): Promise<void> => {
  try {
    const { name } = req.params;
    let rankings: ApiResponse<RankingInterface>;
    const checkDatabase = await getPlayerDatabaseRecent(name);
    if (checkDatabase.success) {
      if (useFilter) {
        rankings = await getRealRankings(name);
      } else {
        rankings = await getRankings(name);
      }
      res.status(200).json(rankings);
      return;
    }
    const playerData = await getPlayer(name);
    if (playerData.success) {
      const savePlayerData = convertToPlayerModel(playerData.data);
      const databaseData = await getPlayerDatabase(name);
      if (databaseData.success) {
        const existingPbs = databaseData.data.stats.pbs;
        if (JSON.stringify(existingPbs) !== JSON.stringify(savePlayerData.stats.pbs)) {
          await savePlayer(savePlayerData);
          await saveLeaderboardAll(name);
          if (useFilter) {
            rankings = await getRealRankings(name);
          } else {
            rankings = await getRankings(name);
          }
          res.status(200).json(rankings);
          return;
        }
      }
      if (useFilter) {
        rankings = await getRealRankings(name);
      } else {
        rankings = await getRankings(name);
      }
      res.status(200).json(rankings);
      await savePlayer(savePlayerData);
      await saveLeaderboardAll(name);
      return;
    }
    if (playerData.error.code === "INVALID_PLAYER") {
      res.status(404).json(playerData);
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: "Unable to retrieve player rankings",
        code: "DATABASE_ERROR"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Unable to retrieve player rankings",
        code: "DATABASE_ERROR"
      }
    });
  }
};

export const getFilteredRankings = (
  req: Request, 
  res: Response<ApiResponse<RankingInterface>>
): Promise<void> => {
  return handleGetRankings(req, res, true);
};

export const getAllRankings = (
  req: Request, 
  res: Response<ApiResponse<RankingInterface>>
): Promise<void> => {
  return handleGetRankings(req, res, false);
};

