import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDatabase(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("missing mongodb uri");
    }
    await mongoose.connect(uri);
    console.log("connected to database");
  } catch (error) {
    console.log("error in connecting to the database");
    process.exit(1);
  }
}

