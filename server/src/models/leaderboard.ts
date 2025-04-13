import { model, Document, Schema } from "mongoose";

interface PlayerInterface {
  _id: string;
  username: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LeaderboardInterface extends Document {
  stat: string;
  players: PlayerInterface[];
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<PlayerInterface>(
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
    players: [PlayerSchema]
  },
  { timestamps: true }
);

const LeaderboardModel = model<LeaderboardInterface>("leaderboard", LeaderboardSchema);
export default LeaderboardModel;