import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const baseUrl = `http://localhost:${PORT}`;

const unknownError = {
  success: false,
  error: {
    message: "There was an unknown error",
    code: "UNKNOWN"
  }
};

// copy paste from the types file in server lmao
const minigamesArray = [
  "animalSlaughter",
  "anvilSpleef",
  "avalanche",
  "bombardment",
  "cannonPainting",
  "chickenRings",
  "dive",
  "fireLeapers",
  "frozenFloor",
  "highGround",
  "hoeHoeHoe",
  "jigsawRush",
  "jungleJump",
  "labEscape",
  "lawnMoower",
  "minecartRacing",
  "pigFishing",
  "pigJousting",
  "rpg16",
  "shootingRange",
  "spiderMaze",
  "superSheep",
  "theFloorIsLava",
  "trampolinio",
  "volcano",
  "workshop"
] as const;

type Minigame = typeof minigamesArray[number];

const lbTypesArray = [
  "pbs",
  "miniWins",
  "totals"
] as const;

type LbType = typeof lbTypesArray[number];

async function callStats(url: string): Promise<object> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return (error.response.data);
      }
    }
    return unknownError;
  }
}

export async function callPlayer(name: string): Promise<object> {
  const url = `${baseUrl}/players/${name}`;
  const response = await callStats(url);
  return response;
}

export async function callLeaderboard(minigame: Minigame, lbType: LbType): Promise<object> {
  const url = `${baseUrl}/leaderboards/${minigame}/${lbType}`;
  const response = await callStats(url);
  return response;
}

export async function callStatus(name: string): Promise<object> {
  const url = `${baseUrl}/statuses/${name}`;
  const response = await callStats(url);
  return response;
}

export async function callRankings(name: string, all: boolean = false): Promise<object> {
  let url: string;
  if (all) {
    url = `${baseUrl}/rankings/${name}/all`;
  } else {
    url = `${baseUrl}/rankings/${name}`;
  }
  const response = await callStats(url);
  return response;
}

export async function callBans(
  name: string, 
  ban: "ban" | "unban",
  minigame?: Minigame,
  lbType?: LbType
): Promise<object> {
  try {
    let url: string;
    if (minigame && lbType) {
      url = `${baseUrl}/bans/${name}/${minigame}/${lbType}`;
    } else {
      url = `${baseUrl}/bans/${name}`;
    }
    if (ban === "ban") {
      await axios.post(url);
    } else if (ban === "unban") {
      await axios.delete(url);
    }
    if (minigame && lbType) {
      return {
        success: true,
        data: `${name} has successfully been ${ban}ned from the ${minigame} ${lbType} leaderboard`
      };
    }
    return {
      success: true,
      data: `${name} has successfully been ${ban}ned`
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return (error.response.data);
      }
    }
    return unknownError;
  }
}