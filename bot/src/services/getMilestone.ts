import { callPlayer } from "./callServer";

export async function getMilestone(name: string): Promise<string> {
  const [player, winsInterval] = name.split(" ");
  let realWinsInterval: number;
  if (!winsInterval) {
    realWinsInterval = 500;
  } else {
    if (winsInterval.endsWith("k") || winsInterval.endsWith("K")) {
      const numberPart = parseFloat(winsInterval.slice(0, -1));
      realWinsInterval = numberPart * 1000;
    } else {
      realWinsInterval = Number(winsInterval);
    }
  }
  if (isNaN(realWinsInterval) || (name.split(" ").length - 1) > 2) {
    return "Please provide a valid input (1 username with a number seperated by a space)";
  }
  const response = await callPlayer(player);
  if (!response.success) {
    return response.error.message;
  }
  const p = response.data;
  const wins = p.stats.wins;
  const winsNeeded = Math.ceil(wins / realWinsInterval) * realWinsInterval;
  return `${p.username} needs **${winsNeeded - wins}** more wins for the next milestone at **${winsNeeded}** wins`;
}