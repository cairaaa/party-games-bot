import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { getRankings, getRealRankings, RankingInterface } from "../services/getRankings";

const handleGetRankings = async (
  req: Request, 
  res: Response<ApiResponse<RankingInterface>>,
  useFilter: boolean = true
): Promise<void> => {
  try {
    const { name } = req.params;
    let rankings: ApiResponse<RankingInterface>;
    if (useFilter) {
      rankings = await getRealRankings(name);
    } else {
      rankings = await getRankings(name);       
    }
    if (rankings.success) {
      res.status(200).json({
        success: true,
        data: rankings.data
      });
      return;
    } else {
      if (rankings.error.code === "INVALID_PLAYER") {
        res.status(404).json({
          success: false,
          error: rankings.error
        });
        return;
      }
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

