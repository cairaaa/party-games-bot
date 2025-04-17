import axios from "axios";
import dotenv from "dotenv";
import { getUUIDDatabase } from "../services/getPlayer";

dotenv.config();
const apiKey = process.env.API_KEY;

async function getUUID(name: string): Promise<string> {
  try {
    const url = `https://api.mojang.com/users/profiles/minecraft/${name}`;
    const response = await axios.get(url);
    return response.data.id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("unable to retrieve uuid, invalid player");
    }
    try {
      const url = `https://api.minecraftservices.com/minecraft/profile/lookup/name/${name}/`;
      const response = await axios.get(url);
      return response.data.id;
    } catch {
      throw new Error("unable to retrieve uuid");
    }
  }
}

export async function getPlayer(name: string): Promise<object> {
  let uuid = await getUUIDDatabase(name);
  if (!uuid) {
    try {
      uuid = await getUUID(name);
    } catch (error) {
      console.log(`unable to get uuid of ${name}`);
      throw error;
    }
  }
  try {
    const url = `https://api.hypixel.net/v2/player?key=${apiKey}&uuid=${uuid}`;
    const response = await axios.get(url);
    return response.data.player;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("unable to retrieve player data, forbidden response");
      } else if (error.response?.status === 404) {
        throw new Error("unable to retrieve player data, invalid player");
      } else if (error.response?.status === 429) {
        throw new Error("unable to retrieve player data, too many requests");
      }
    }
    throw new Error("unable to retrieve player data");
  }
}

interface StatusData {
  online: boolean;
  gameType: string;
  map?: string;
  mode: string;
}

export async function getStatus(name: string): Promise<StatusData> {
  let uuid = await getUUIDDatabase(name);
  if (!uuid) {
    try {
      uuid = await getUUID(name);
    } catch (error) {
      console.log(`unable to get uuid of ${name}`);
      throw error;
    }
  }

  try {
    const url = `https://api.hypixel.net/v2/status?key=${apiKey}&uuid=${uuid}`;
    const response = await axios.get(url);
    return response.data.session;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("unable to retrieve player status, forbidden response");
      } else if (error.response?.status === 404) {
        throw new Error("unable to retrieve player status, invalid player");
      } else if (error.response?.status === 429) {
        throw new Error("unable to retrieve player status, too many requests");
      }
    }
    throw new Error("unable to retrieve player status");
  }
}