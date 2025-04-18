import { LeaderboardModel } from "../models/leaderboard";
import { Minigame, LbType } from "../types";

export async function banLeaderboardsAll(name: string): Promise<void> {
  await LeaderboardModel.updateMany(
    { "players.username": name },
    { $set: { "players.$[player].banned": true } },
    { 
      arrayFilters: [{ "player.username": name }],
      collation: { locale: "en", strength: 2 }
    }
  );
}

export async function banLeaderboardOne(
  name: string, 
  minigame: Minigame, 
  type: LbType
): Promise<void> {
  await LeaderboardModel.updateOne(
    { minigame, type, "players.username": name },
    { $set: { "players.$.banned": true } },
    { collation: { locale: "en", strength: 2 } }
  );
}

export async function unbanLeaderboardsAll(name: string): Promise<void> {
  await LeaderboardModel.updateMany(
    { "players.username": name },
    { $unset: { "players.$[player].banned": "" } },
    { 
      arrayFilters: [{ "player.username": name }],
      collation: { locale: "en", strength: 2 }
    }
  );
}

export async function unbanLeaderboardOne(
  name: string, 
  minigame: Minigame, 
  type: LbType
): Promise<void> {
  await LeaderboardModel.updateOne(
    { minigame, type, "players.username": name },
    { $unset: { "players.$.banned": "" } },
    { collation: { locale: "en", strength: 2 } }
  );
}
  