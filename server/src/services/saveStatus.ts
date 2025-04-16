import { StatusInterface, StatusModel } from "../models/status";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToStatusModel(apiData: any): StatusInterface {
  try {
    if (!apiData.lastLogout) {
      throw new Error(`${apiData.displayname} has the api off`);
    }
    const playerStatus = {
      _id: apiData.uuid,
      username: apiData.displayname,
      lastLogin: apiData.lastLogin,
      lastLogout: apiData.lastLogout,
      expiresAt: new Date(Date.now() + 60000)
    };
    console.log(playerStatus);
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