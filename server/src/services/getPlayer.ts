import { PlayerModel, PlayerInterface } from "../models/player";

export async function getUUIDDatabase(name: string): Promise<string> {
  const player = await PlayerModel.findOne({ username: name });
  if (!player) {
    throw new Error(`player ${name} not found in database, can't get uuid`);
  }
  return player._id;
}

export async function getPlayerDatabase(name: string): Promise<PlayerInterface> {
  const player = await PlayerModel.findOne({ username: name });
  if (!player) {
    throw new Error(`player ${name} not found in database, can't get stats`);
  }
  return player;
}

export async function getPlayerDatabaseRecent(name: string): Promise<PlayerInterface> {
  const player = await PlayerModel.findOne({ username: name });
  if (!player) {
    throw new Error(`player ${name} not found in database, can't get stats`);
  }
  const now = new Date();
  const updatedAt = player.updatedAt;
  const time = now.getTime() - updatedAt!.getTime();
  if (time > 30000) {
    throw new Error("the data is not recent enough to return, please call on the hypixel api");
  }
  return player;
}