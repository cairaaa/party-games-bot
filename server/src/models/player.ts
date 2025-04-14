import { model, Document, Schema } from "mongoose";

export interface PlayerInterface extends Document {
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

const PlayerSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    stats: {
      wins: { type: Number, required: true },
      rounds: { type: Number, required: true },
      stars: { type: Number, required: true },
      pbs: {
        anvilSpleefTime: { type: Number, required: true },
        bombardmentTime: { type: Number, required: true },
        chickenRingsTime: { type: Number, required: true },
        jigsawRushTime: { type: Number, required: true },
        jungleJumpTime: { type: Number, required: true },
        labEscapeTime: { type: Number, required: true },
        minecartRacingTime: { type: Number, required: true },
        spiderMazeTime: { type: Number, required: true },
        theFloorIsLavaTime: { type: Number, required: true },
        animalSlaughterScore: { type: Number, required: true },
        diveScore: { type: Number, required: true },
        highGroundScore: { type: Number, required: true },
        hoeHoeHoeScore: { type: Number, required: true },
        lawnMoowerScore: { type: Number, required: true },
        rpg16Score: { type: Number, required: true },
      },
      miniWins: {
        animalSlaughter: { type: Number, required: true },
        anvilSpleef: { type: Number, required: true },
        avalanche: { type: Number, required: true },
        bombardment: { type: Number, required: true },
        cannonPainting: { type: Number, required: true },
        chickenRings: { type: Number, required: true },
        dive: { type: Number, required: true },
        fireLeapers: { type: Number, required: true },
        frozenFloor: { type: Number, required: true },
        highGround: { type: Number, required: true },
        hoeHoeHoe: { type: Number, required: true },
        jigsawRush: { type: Number, required: true },
        jungleJump: { type: Number, required: true },
        labEscape: { type: Number, required: true },
        lawnMoower: { type: Number, required: true },
        minecartRacing: { type: Number, required: true },
        pigFishing: { type: Number, required: true },
        pigJousting: { type: Number, required: true },
        rpg16: { type: Number, required: true },
        shootingRange: { type: Number, required: true },
        spiderMaze: { type: Number, required: true },
        superSheep: { type: Number, required: true },
        theFloorIsLava: { type: Number, required: true },
        trampolinio: { type: Number, required: true },
        volcano: { type: Number, required: true },
        workshop: { type: Number, required: true },
      },
      totals: {
        animalSlaughterKills: { type: Number, required: true },
        diveScore: { type: Number, required: true },
        highGroundScore: { type: Number, required: true },
        hoeHoeHoeScore: { type: Number, required: true },
        lawnMoowerScore: { type: Number, required: true },
        rpg16Kills: { type: Number, required: true }
      }
    },
  },
  { timestamps: true }
);

export const PlayerModel = model<PlayerInterface>("player", PlayerSchema);