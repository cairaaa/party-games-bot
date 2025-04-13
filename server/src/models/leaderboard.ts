import { model, Document, Schema } from "mongoose";

export interface LeaderboardPlayerInterface {
  _id: string;
  username: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardInterface extends Document {
  stat: string;
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
    stat: { type: String, required: true, unique: true },
    players: [LeaderboardPlayerSchema]
  },
  { timestamps: true }
);

export const LeaderboardPlayerModel = model<LeaderboardPlayerInterface>("leaderboardPlayer", LeaderboardPlayerSchema);
export const LeaderboardModel = model<LeaderboardInterface>("leaderboard", LeaderboardSchema);