import { callPass } from "./callServer";

export async function getPass(names: string): Promise<string> {
  const response = await callPass(names);
  if (!response.success) {
    return response.error.message;
  }
  const p1 = response.data.firstPlayer;
  const p2 = response.data.secondPlayer;
  if (p1.stats.wins === p2.stats.wins) {
    return `${p1.username} is tied with ${p2.username} at ${p1.stats.wins}`;
  } else if (p1.stats.wins > p2.stats.wins) {
    return `${p2.username} is **${p1.stats.wins - p2.stats.wins}** wins away from ${p1.username}`;
  } else {
    return `${p1.username} is **${p2.stats.wins - p1.stats.wins}** wins away from ${p2.username}`;
  }
}