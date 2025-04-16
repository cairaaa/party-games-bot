import { PlayerModel, PlayerInterface } from "../models/player";

export async function getUUIDDatabase(name: string): Promise<string | null> {
  const player = await PlayerModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return null;
  }
  return player._id;
}

export async function getPlayerDatabase(name: string): Promise<PlayerInterface | null> {
  const player = await PlayerModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return null;
  }
  return player;
}

export async function getPlayerDatabaseRecent(name: string): Promise<PlayerInterface | null> {
  const player = await PlayerModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return null;
  }
  const now = new Date();
  const updatedAt = player.updatedAt;
  const time = now.getTime() - updatedAt!.getTime();
  if (time > 60000) {
    return null;
  }
  return player;
}