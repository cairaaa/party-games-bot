import { model, Document, Schema } from "mongoose";
import { Minigame, LbType } from "../types";

export interface LeaderboardPlayerInterface {
  _id: string;
  username: string;
  value: number;
  banned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeaderboardInterface extends Document {
  minigame: Minigame;
  type: LbType;
  players: LeaderboardPlayerInterface[];
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardPlayerSchema = new Schema<LeaderboardPlayerInterface>(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    value: { type: Number, required: true },
    banned: { type: Boolean }
  },
  { timestamps: true }
);

const LeaderboardSchema = new Schema<LeaderboardInterface>(
  {
    minigame: { type: String, required: true },
    type: { type: String, required: true },
    players: [LeaderboardPlayerSchema]
  },
  { timestamps: true }
);

LeaderboardSchema.index({ "players._id": 1 });
LeaderboardSchema.index(
  { "players.username": 1 },
  { collation: { locale: "en", strength: 2 } }
);

export const LeaderboardModel = model<LeaderboardInterface>("leaderboard", LeaderboardSchema);