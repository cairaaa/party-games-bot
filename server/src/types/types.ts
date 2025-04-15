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

export type Minigame = typeof minigamesArray[number];

const lbTypesArray = [
  "pbs",
  "miniWins",
  "totals"
] as const;

export type LbType = typeof lbTypesArray[number];