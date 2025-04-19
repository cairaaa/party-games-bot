import express, { Request, Response } from "express";
import { playerRouter } from "./routes/playerRouter";
import { connectToDatabase } from "./database/db";
import cors from "cors";
import { leaderboardRouter } from "./routes/leaderboardRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("leafeon");
});

app.use("/players", playerRouter);
app.use("/leaderboards", leaderboardRouter);

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