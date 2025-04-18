import axios from "axios";
import dotenv from "dotenv";
import { getUUIDDatabase } from "../services/getPlayer";
import { ApiResponse } from "../types";

dotenv.config();
const apiKey = process.env.API_KEY;

async function getUUID(name: string): Promise<ApiResponse<string>> {
  try {
    const url = `https://api.mojang.com/users/profiles/minecraft/${name}`;
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data.id
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { 
        success: false, 
        error: { 
          message: `Unable to retrieve ${name} uuid, the person does not exist`,
          code: "INVALID_PLAYER"
        } 
      };
    }
    try {
      const url = `https://api.minecraftservices.com/minecraft/profile/lookup/name/${name}/`;
      const response = await axios.get(url);
      return {
        success: true,
        data: response.data.id
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Unknown error in getting the UUID",
          code: "API_ERROR"
        }
      };
    }
  }
}

export async function getPlayer(name: string): Promise<ApiResponse<object>> {
  let uuid: string = "";
  try {
    const uuidDb = await getUUIDDatabase(name);
    if (uuidDb.success) {
      uuid = uuidDb.data;
    } else {
      const uuidApi = await getUUID(name);
      if (uuidApi.success) {
        uuid = uuidApi.data;
      } else {
        if (uuidApi.error.code === "INVALID_PLAYER") {
          return {
            success: false,
            error: {
              message: `Couldn't find a player by the username ${name}`,
              code: "INVALID_PLAYER"
            }
          };
        }
        return {
          success: false,
          error: {
            message: `Unable to retrieve player data for ${name}, ` +
            "because the UUID could not be retrieved",
            code: "API_DATABASE_ERROR"
          }
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: `There was an unknown error while getting ${name}'s UUID`,
        code: "UNKNOWN"
      }
    };
  }

  try {
    const url = `https://api.hypixel.net/v2/player?key=${apiKey}&uuid=${uuid}`;
    const response = await axios.get(url);
    if (!response.data.player) {
      return {
        success: false,
        error: {
          message: `Couldn't find a player by the username ${name}`,
          code: "INVALID_PLAYER"
        }
      };
    }
    return {
      success: true,
      data: response.data.player
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return {
          success: false,
          error: {
            message: `Unable to retrieve player data for ${name}, ` + 
            "due to a forbidden response by hypixel",
            code: "FORBIDDEN_RESPONSE"
          }
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: {
            message: `Couldn't find a player by the username ${name}`,
            code: "INVALID_PLAYER"
          }
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: {
            message: `Unable to retrieve player data for ${name}, ` +
            "there have been too many requests, please wait for a couple of minutes",
            code: "RATE_LIMIT_EXCEEDED"
          }
        };
      }
    }
    return {
      success: false,
      error: {
        message: `Unable to retrieve player data for ${name}`,
        code: "UNKNOWN"
      }
    };
  }
}

interface StatusData {
  online: boolean;
  gameType: string;
  map?: string;
  mode: string;
}

export async function getStatus(name: string): Promise<ApiResponse<StatusData>> {
  let uuid: string = "";
  try {
    const uuidDb = await getUUIDDatabase(name);
    if (uuidDb.success) {
      uuid = uuidDb.data;
    } else {
      const uuidApi = await getUUID(name);
      if (uuidApi.success) {
        uuid = uuidApi.data;
      } else {
        if (uuidApi.error.code === "INVALID_PLAYER") {
          return {
            success: false,
            error: {
              message: `Couldn't find a player by the username ${name}`,
              code: "INVALID_PLAYER"
            }
          };
        }
        return {
          success: false,
          error: {
            message: `Unable to retrieve player data for ${name}, ` +
            "because the UUID could not be retrieved",
            code: "API_DATABASE_ERROR"
          }
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: `There was an unknown error while getting ${name}'s UUID`,
        code: "UNKNOWN"
      }
    };
  }

  try {
    const url = `https://api.hypixel.net/v2/status?key=${apiKey}&uuid=${uuid}`;
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data.session
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return {
          success: false,
          error: {
            message: `Unable to retrieve player status for ${name}, ` + 
            "due to a forbidden response by hypixel",
            code: "FORBIDDEN_RESPONSE"
          }
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: {
            message: `Couldn't find a player by the username ${name}`,
            code: "INVALID_PLAYER"
          }
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: {
            message: `Unable to retrieve player status for ${name}, ` +
            "there have been too many requests, please wait for a couple of minutes",
            code: "RATE_LIMIT_EXCEEDED"
          }
        };
      }
    }
    return {
      success: false,
      error: {
        message: `Unable to retrieve player status for ${name}`,
        code: "UNKNOWN"
      }
    };
  }
}