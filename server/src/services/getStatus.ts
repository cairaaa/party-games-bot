import { StatusInterface, StatusModel } from "../models/status";

export async function getStatusDatabase(name: string): Promise<StatusInterface> {
  const player = await StatusModel.findOne(
        { username: name },
        null,
        { collation: { locale: "en", strength: 2 } }
      );
  if (!player) {
    throw new Error(`${name} was not found in the database, please call on hypixel api`);
  }
  return player;
}