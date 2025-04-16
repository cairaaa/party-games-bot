import { StatusInterface, StatusModel } from "../models/status";
import { getStatus } from "../api/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertToStatusModel(apiData: any): Promise<StatusInterface> {
  try {
    if (!apiData.lastLogout) {
      throw new Error(`${apiData.displayname} has the api off`);
    }
    if (apiData.lastLogin > apiData.lastLogout) {
      const statusData = await getStatus(apiData.displayname);
      console.log(statusData);
      const playerStatus = {
        _id: apiData.uuid,
        username: apiData.displayname,
        lastLogin: apiData.lastLogin,
        lastLogout: apiData.lastLogout,
        gameType: statusData.gameType,
        mode: statusData.mode,
        expiresAt: new Date(Date.now() + 60000)
      };
      return new StatusModel(playerStatus);
    }
    const playerStatus = {
      _id: apiData.uuid,
      username: apiData.displayname,
      lastLogin: apiData.lastLogin,
      lastLogout: apiData.lastLogout,
      expiresAt: new Date(Date.now() + 60000)
    };
    return new StatusModel(playerStatus);
  } catch (error) {
    console.log("couldn't convert the data into a status model");
    throw error;
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
    throw error;
  }
}