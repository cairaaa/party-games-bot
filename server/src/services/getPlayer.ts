import { PlayerModel } from "../models/player";

export async function getUUIDDatabase(name: string): Promise<string> {
  const player = await PlayerModel.findOne({ username: name });
  if (!player) {
    throw new Error("player not found in database, can't get uuid");
  }
  return player._id;
}