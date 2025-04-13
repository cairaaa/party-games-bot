import { model, Document, Schema } from "mongoose";

export interface LeaderboardPlayerInterface {
  _id: string;
  username: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardInterface extends Document {
  minigame: string;
  type: string;
  players: LeaderboardPlayerInterface[];
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardPlayerSchema = new Schema<LeaderboardPlayerInterface>(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    value: { type: Number, required: true }
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

export const LeaderboardModel = model<LeaderboardInterface>("leaderboard", LeaderboardSchema);