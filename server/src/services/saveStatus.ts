import { StatusInterface, StatusModel } from "../models/status";
import { getStatus } from "../api";
import { ApiResponse } from "@shared-types/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertToStatusModel(apiData: any): Promise<ApiResponse<StatusInterface>> {
  try {
    if (!apiData.lastLogout) {
      return {
        success: false,
        error: {
          message: "The player likely has the API off",
          code: "API_OFF"
        }
      };
    }
    if (apiData.lastLogin > apiData.lastLogout) {
      const statusData = await getStatus(apiData.displayname);
      if (!statusData.success) {
        return statusData;
      }
      const playerStatus = {
        _id: apiData.uuid,
        username: apiData.displayname,
        lastLogin: apiData.lastLogin,
        lastLogout: apiData.lastLogout,
        gameType: statusData.data.gameType,
        mode: statusData.data.mode,
        expiresAt: new Date(Date.now() + 60000)
      };
      return {
        success: true,
        data: new StatusModel(playerStatus)
      };
    }
    const playerStatus = {
      _id: apiData.uuid,
      username: apiData.displayname,
      lastLogin: apiData.lastLogin,
      lastLogout: apiData.lastLogout,
      expiresAt: new Date(Date.now() + 60000)
    };
    return {
      success: true,
      data: new StatusModel(playerStatus)
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {
        message: "There was an unknown error while converting the api data",
        code: "UNKNOWN"
      }
    };
  }
}

export async function saveStatus(data: StatusInterface): Promise<void> {
  try {
    await StatusModel.findOneAndUpdate(
      { username: data.username },
      data,
      { upsert: true }
    );
  } catch (error) {
    console.log(`there was an error while saving the status of ${data.username} in the database`);
  }
}