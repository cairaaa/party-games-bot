import express, { Request, Response } from "express";
import cors from "cors";
import { connectToDatabase } from "./database/db";
import { playerRouter } from "./routes/playerRouter";
import { leaderboardRouter } from "./routes/leaderboardRouter";
import { rankingsRouter } from "./routes/rankingsRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/players", playerRouter);
app.use("/leaderboards", leaderboardRouter);
app.use("/rankings", rankingsRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("leafeon");
});

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