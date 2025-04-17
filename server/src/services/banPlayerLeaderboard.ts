import { LeaderboardModel } from "../models/leaderboard";
import { Minigame, LbType } from "../types/types";

export async function banLeaderboardsAll(name: string): Promise<void> {
  await LeaderboardModel.updateMany(
    { "players.username": name },
    { $set: { "players.$[player].banned": true } },
    { arrayFilters: [{ "player.username": name }] }
  );
}

export async function banLeaderboardOne(
  name: string, 
  minigame: Minigame, 
  type: LbType
  ): Promise<void> {
  await LeaderboardModel.updateOne(
    { minigame, type, "players.username": name },
    { $set: { "players.$.banned": true } }
  );
}

export async function unbanLeaderboardsAll(name: string): Promise<void> {
  await LeaderboardModel.updateMany(
    { "players.username": name },
    { $unset: { "players.$.banned": "" } }
  );
}

export async function unbanLeaderboardsOne(
  name: string, 
  minigame: Minigame, 
  type: LbType
  ): Promise<void> {
  await LeaderboardModel.updateOne(
    { minigame, type, "players.username": name },
    { $unset: { "players.$.banned": "" } }
  );
}
  