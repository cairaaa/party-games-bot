import { Minigame, LbType } from ".";

export interface PlayerInterface {
  _id: string;
  username: string;
  stats: {
    wins: number;
    rounds: number;
    stars: number;
    pbs: {
      anvilSpleefTime: number;
      bombardmentTime: number;
      chickenRingsTime: number;
      jigsawRushTime: number;
      jungleJumpTime: number;
      labEscapeTime: number;
      minecartRacingTime: number;
      spiderMazeTime: number;
      theFloorIsLavaTime: number;
      animalSlaughterScore: number;
      diveScore: number;
      highGroundScore: number;
      hoeHoeHoeScore: number;
      lawnMoowerScore: number;
      rpg16Score: number;
    };
    miniWins: {
      animalSlaughter: number;
      anvilSpleef: number;
      avalanche: number;
      bombardment: number;
      cannonPainting: number;
      chickenRings: number;
      dive: number;
      fireLeapers: number;
      frozenFloor: number;
      highGround: number;
      hoeHoeHoe: number;
      jigsawRush: number;
      jungleJump: number;
      labEscape: number;
      lawnMoower: number;
      minecartRacing: number;
      pigFishing: number;
      pigJousting: number;
      rpg16: number;
      shootingRange: number;
      spiderMaze: number;
      superSheep: number;
      theFloorIsLava: number;
      trampolinio: number;
      volcano: number;
      workshop: number;
    };
    totals: {
      animalSlaughterKills: number;
      diveScore: number;
      highGroundScore: number;
      hoeHoeHoeScore: number;
      lawnMoowerScore: number;
      rpg16Kills: number;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaderboardPlayerInterface {
  _id: string;
  username: string;
  value: number;
  banned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeaderboardInterface {
  minigame: Minigame;
  type: LbType;
  players: LeaderboardPlayerInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusInterface {
  _id: string;
  username: string;
  lastLogin: number;
  lastLogout?: number;
  gameType?: string;
  mode?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RankingMinigameInterface {
  minigame: Minigame;
  place: number | null;
  value: number | null;
}

export interface RankingInterface {
  _id: string;
  username: string;
  rankings: RankingMinigameInterface[];
}
