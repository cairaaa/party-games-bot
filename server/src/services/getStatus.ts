import { StatusInterface, StatusModel } from "../models/status";

export async function getStatusDatabase(name: string): Promise<StatusInterface | null> {
  const player = await StatusModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return null;
  }
  return player;
}