import { model, Document, Schema } from "mongoose";

export interface StatusInterface extends Document {
  _id: string;
  username: string;
  lastLogin: number;
  lastLogout?: number;
  gameType?: string;
  mode?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const StatusSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    lastLogin: { type: Number, required: true },
    lastLogout: { type: Number },
    gameType: { type: String },
    mode: { type: String },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

StatusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export const StatusModel = model<StatusInterface>("status", StatusSchema);