// for random intefaces/types and stuff

export const minigamesArray = [
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

export type Minigame = typeof minigamesArray[number];

export const lbTypesArray = [
  "pbs",
  "miniWins",
  "totals"
] as const;

export type LbType = typeof lbTypesArray[number];

const errorArray = [
  "FORBIDDEN_RESPONSE",
  "INVALID_PLAYER",
  "INVALID_PARAMS",
  "OUTDATED_DATA",
  "API_ERROR",
  "DATABASE_ERROR",
  "API_DATABASE_ERROR",
  "RATE_LIMIT_EXCEEDED",
  "API_OFF",
  "UNKNOWN"
] as const;

type ErrorTypes = typeof errorArray[number];

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    message: string;
    code: ErrorTypes;
  };
};

export function isAscending(minigame: Minigame): boolean {
  const minigames: Minigame[] = [
    "chickenRings",
    "jigsawRush",
    "jungleJump",
    "labEscape",
    "minecartRacing",
    "spiderMaze",
    "theFloorIsLava"
  ];
  return minigames.includes(minigame);
}