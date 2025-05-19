import { callPlayer } from "./callServer";

export async function getMilestone(name: string): Promise<string> {
  const response = await callPlayer(name);
  if (!response.success) {
    return response.error.message;
  }
  const p = response.data;
  const wins = p.stats.wins;
  const winsNeeded = Math.ceil(wins / 500) * 500;
  return `${p.username} needs **${winsNeeded - wins}** more wins for the next milestone at **${winsNeeded}** wins`;
}