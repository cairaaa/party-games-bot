import axios from "axios";
import dotenv from "dotenv";
import { Minigame, LbType, ApiResponse } from "@shared-types/types"
import { PlayerInterface, LeaderboardInterface } from "@shared-types/interfaces";
import { StatusInterface, RankingInterface } from "@shared-types/interfaces"

dotenv.config();

const PORT = process.env.PORT || 3000;
const baseUrl = `http://localhost:${PORT}`;

function returnUnknown<T>(): ApiResponse<T> {
  const unknownError = {
    success: false as const,
    error: {
      message: "There was an unknown error",
      code: "UNKNOWN" as const
    }
  }
  return unknownError;
}

async function callStats<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ApiResponse<T>;
      }
    }
    return returnUnknown();
  }
}

export async function callPlayer(name: string): Promise<ApiResponse<PlayerInterface>> {
  const url = `${baseUrl}/players/${name}`;
  const response = await callStats<PlayerInterface>(url);
  return response;
}

export async function callLeaderboard(
  minigame: Minigame, 
  lbType: LbType
): Promise<ApiResponse<LeaderboardInterface>> {
  const url = `${baseUrl}/leaderboards/${minigame}/${lbType}`;
  const response = await callStats<LeaderboardInterface>(url);
  return response;
}

export async function callStatus(name: string): Promise<ApiResponse<StatusInterface>> {
  const url = `${baseUrl}/statuses/${name}`;
  const response = await callStats<StatusInterface>(url);
  return response;
}

export async function callRankings(
  name: string, 
  all: boolean = false
): Promise<ApiResponse<RankingInterface>> {
  let url: string;
  if (all) {
    url = `${baseUrl}/rankings/${name}/all`;
  } else {
    url = `${baseUrl}/rankings/${name}`;
  }
  const response = await callStats<RankingInterface>(url);
  return response;
}

export async function callBans(
  name: string, 
  ban: "ban" | "unban",
  minigame?: Minigame,
  lbType?: LbType
): Promise<ApiResponse<string>> {
  try {
    let url: string;
    if (minigame && lbType) {
      url = `${baseUrl}/bans/${name}/${minigame}/${lbType}`;
    } else {
      url = `${baseUrl}/bans/${name}`;
    }
    if (ban === "ban") {
      await axios.post(url);
    } else if (ban === "unban") {
      await axios.delete(url);
    }
    if (minigame && lbType) {
      return {
        success: true,
        data: `${name} has successfully been ${ban}ned from the ${minigame} ${lbType} leaderboard`
      };
    }
    return {
      success: true,
      data: `${name} has successfully been ${ban}ned`
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return (error.response.data);
      }
    }
    return returnUnknown();
  }
}