import { PlayerModel, PlayerInterface } from "../models/player";
import { ApiResponse } from "@shared-types/types";

export async function getUUIDDatabase(name: string): Promise<ApiResponse<string>> {
  try {
    const player = await PlayerModel.findOne(
      { username: name },
      null,
      { collation: { locale: "en", strength: 2 } }
    );
    if (!player) {
      return {
        success: false,
        error: {
          message: `Unable to retrieve ${name} data from the database, please use the api instead`,
          code: "INVALID_PLAYER"
        }
      };
    }
    return {
      success: true,
      data: player._id
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {
        message: "There was an unknown error while retrieving the UUID from the database",
        code: "DATABASE_ERROR"
      }
    };
  }
}

export async function getPlayerDatabase(name: string): Promise<ApiResponse<PlayerInterface>> {
  const player = await PlayerModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return {
      success: false,
      error: {
        message: "The player is not in the database",
        code: "INVALID_PLAYER"
      }
    };
  }
  return {
    success: true,
    data: player
  };
}

export async function getPlayerDatabaseRecent(name: string): Promise<ApiResponse<PlayerInterface>> {
  const player = await PlayerModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return {
      success: false,
      error: {
        message: "The player is not in the database",
        code: "INVALID_PLAYER"
      }
    };
  }
  const now = new Date();
  const updatedAt = player.updatedAt;
  const time = now.getTime() - updatedAt!.getTime();
  if (time > 60000) {
    return {
      success: false,
      error: {
        message: "The player is outdated, please call on the hypixel api",
        code: "OUTDATED_DATA"
      }
    };
  }
  return {
    success: true,
    data: player
  };
}