import { LeaderboardModel } from "../models/leaderboard";
import { Minigame } from "@shared-types/types";
import { ApiResponse, isAscending } from "@shared-types/types";
import { getPlayerDatabase } from "./getPlayer";

export interface RankingInterface {
  _id: string;
  username: string;
  stats: {
    wins: number;
    rounds: number;
    stars: number;
  };
  rankings: RankingMinigameInterface[];
}

interface RankingMinigameInterface {
  minigame: Minigame;
  place: number | null;
  value: number | null;
}

export async function getRankings(name: string): Promise<ApiResponse<RankingInterface>> {
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
        return {
          success: false,
          error: {
            message: `Couldn't find a player by the username ${name}`,
            code: "INVALID_PLAYER"
          }
        };
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
      if (player.value === 0) {
        rankings.push({
          minigame: lb.minigame,
          place: null,
          value: null
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
      return {
        success: false,
        error: {
          message: `Couldn't find a player by the username ${name}`,
          code: "INVALID_PLAYER"
        }
      };
    }
    rankings.sort((a, b) => {
      if (a.place === null && b.place === null) {
        return 0; 
      } else if (a.place === null) {
        return 1;
      } else if (b.place === null) {
        return -1;
      } else {
        return a.place - b.place;
      }
    });
    const playerResponse = await getPlayerDatabase(name);
    if (!playerResponse.success) {
      return {
        success: false,
        error: {
          message: "Couldn't get rankings from the database",
          code: "DATABASE_ERROR"
        }
      };
    }
    const player = playerResponse.data;
    const rankingsData = {
      _id: uuid,
      username: realUsername,
      stats: {
        wins: player.stats.wins,
        rounds: player.stats.rounds,
        stars: player.stats.stars
      },
      rankings: rankings
    };
    return {
      success: true,
      data: rankingsData
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Couldn't get rankings from the database",
        code: "DATABASE_ERROR"
      }
    };
  }
}

export async function getRealRankings(name: string): Promise<ApiResponse<RankingInterface>> {
  const rankingsResponse = await getRankings(name);
  if (!rankingsResponse.success) {
    return rankingsResponse;
  }
  const excludedMinigames: Minigame[] = ["dive", "highGround", "minecartRacing", "rpg16"];
  const rankings = rankingsResponse.data.rankings;
  const realRankings = rankings.filter(ranking => 
    !excludedMinigames.includes(ranking.minigame)
  );
  const realData = {
    _id: rankingsResponse.data._id,
    username: rankingsResponse.data.username,
    stats: {
      wins: rankingsResponse.data.stats.wins,
      rounds: rankingsResponse.data.stats.rounds,
      stars: rankingsResponse.data.stats.stars
    },
    rankings: realRankings
  };
  return {
    success: true,
    data: realData
  };
}