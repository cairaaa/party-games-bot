import express, { Request, Response } from "express";
import playerRouter from "./routes/playerRouter";
import { connectToDatabase } from "./database/db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/player", playerRouter);

export const connect = async (): Promise<void> => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect");
    process.exit(1);
  }
};

connect();