import { PlayerInterface, PlayerModel } from "../models/player";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToPlayerModel(apiData: any): PlayerInterface {
  const totalWins: number = (
    (apiData?.stats?.Arcade?.wins_party ?? 0) +
    (apiData?.stats?.Arcade?.wins_party_2 ?? 0) +
    (apiData?.stats?.Arcade?.wins_party_3 ?? 0)
  );
  const playerStats = {
    _id: apiData.uuid,
    username: apiData.displayname,
    stats: {
      wins: totalWins,
      rounds: apiData?.stats?.Arcade?.round_wins_party ?? 0,
      stars: apiData?.stats?.Arcade?.total_stars_party ?? 0,
      pbs: {
        anvilSpleefTime: (apiData?.stats?.Arcade?.anvil_spleef_best_time_party ?? 0) / 1000,
        bombardmentTime: (apiData?.stats?.Arcade?.bombardment_best_time_party ?? 0) / 1000,
        chickenRingsTime: (apiData?.stats?.Arcade?.chicken_rings_best_time_party ?? 0) / 1000,
        jigsawRushTime: (apiData?.stats?.Arcade?.jigsaw_rush_best_time_party ?? 0) / 1000,
        jungleJumpTime: (apiData?.stats?.Arcade?.jungle_jump_best_time_party ?? 0) / 1000,
        labEscapeTime: (apiData?.stats?.Arcade?.lab_escape_best_time_party ?? 0) / 1000,
        minecartRacingTime: (apiData?.stats?.Arcade?.minecart_racing_best_time_party ?? 0) / 1000,
        spiderMazeTime: (apiData?.stats?.Arcade?.spider_maze_best_time_party ?? 0) / 1000,
        theFloorIsLavaTime: (apiData?.stats?.Arcade?.the_floor_is_lava_best_time_party ?? 0) / 1000,
        animalSlaughterScore: apiData?.stats?.Arcade?.animal_slaughter_best_score_party ?? 0,
        diveScore: apiData?.stats?.Arcade?.dive_best_score_party ?? 0,
        highGroundScore: apiData?.stats?.Arcade?.high_ground_best_score_party ?? 0,
        hoeHoeHoeScore: apiData?.stats?.Arcade?.hoe_hoe_hoe_best_score_party ?? 0,
        lawnMoowerScore: apiData?.stats?.Arcade?.lawn_moower_mowed_best_score_party ?? 0,
        rpg16Score: apiData?.stats?.Arcade?.rpg_16_kills_best_score_party ?? 0
      },
      miniWins: {
        animalSlaughter: apiData?.stats?.Arcade?.animal_slaughter_round_wins_party ?? 0,
        anvilSpleef: apiData?.stats?.Arcade?.anvil_spleef_round_wins_party ?? 0,
        avalanche: apiData?.stats?.Arcade?.avalanche_round_wins_party ?? 0,
        bombardment: apiData?.stats?.Arcade?.bombardment_round_wins_party ?? 0,
        cannonPainting: apiData?.stats?.Arcade?.cannon_painting_round_wins_party ?? 0,
        chickenRings: apiData?.stats?.Arcade?.chicken_rings_round_wins_party ?? 0,
        dive: apiData?.stats?.Arcade?.dive_round_wins_party ?? 0,
        fireLeapers: apiData?.stats?.Arcade?.fire_leapers_round_wins_party ?? 0,
        frozenFloor: apiData?.stats?.Arcade?.frozen_floor_round_wins_party ?? 0,
        highGround: apiData?.stats?.Arcade?.high_ground_round_wins_party ?? 0,
        hoeHoeHoe: apiData?.stats?.Arcade?.hoe_hoe_hoe_round_wins_party ?? 0,
        jigsawRush: apiData?.stats?.Arcade?.jigsaw_rush_round_wins_party ?? 0,
        jungleJump: apiData?.stats?.Arcade?.jungle_jump_round_wins_party ?? 0,
        labEscape: apiData?.stats?.Arcade?.lab_escape_round_wins_party ?? 0,
        lawnMoower: apiData?.stats?.Arcade?.lawn_moower_round_wins_party ?? 0,
        minecartRacing: apiData?.stats?.Arcade?.minecart_racing_round_wins_party ?? 0,
        pigFishing: apiData?.stats?.Arcade?.pig_fishing_round_wins_party ?? 0,
        pigJousting: apiData?.stats?.Arcade?.pig_jousting_round_wins_party ?? 0,
        rpg16: apiData?.stats?.Arcade?.rpg_16_round_wins_party ?? 0,
        shootingRange: apiData?.stats?.Arcade?.shooting_range_round_wins_party ?? 0,
        spiderMaze: apiData?.stats?.Arcade?.spider_maze_round_wins_party ?? 0,
        superSheep: apiData?.stats?.Arcade?.super_sheep_round_wins_party ?? 0,
        theFloorIsLava: apiData?.stats?.Arcade?.the_floor_is_lava_round_wins_party ?? 0,
        trampolinio: apiData?.stats?.Arcade?.trampolinio_round_wins_party ?? 0,
        volcano: apiData?.stats?.Arcade?.volcano_round_wins_party ?? 0,
        workshop: apiData?.stats?.Arcade?.workshop_round_wins_party ?? 0
      },
      totals: {
        animalSlaughterKills: apiData?.stats?.Arcade?.animal_slaughter_kills_party ?? 0,
        diveScore: apiData?.stats?.Arcade?.dive_total_score_party ?? 0,
        highGroundScore: apiData?.stats?.Arcade?.high_ground_total_score_party ?? 0,
        hoeHoeHoeScore: apiData?.stats?.Arcade?.hoe_hoe_hoe_total_score_party ?? 0,
        lawnMoowerScore: apiData?.stats?.Arcade?.lawn_moower_mowed_total_score_party ?? 0,
        rpg16Kills: apiData?.stats?.Arcade?.rpg_16_kills_party ?? 0
      }
    }
  };
  return new PlayerModel(playerStats);
}

export async function savePlayer(data: PlayerInterface): Promise<void> {
  try {
    const existing = await PlayerModel.findById(data._id);
    if (existing) {
      // not ai at all!!!
      // i couldnt get __v to incrememnt by myself :(
      const { _id, ...updateData } = data;
      await PlayerModel.findByIdAndUpdate(
        _id, 
        { $set: updateData, $inc: { __v: 1 } }, 
        { new: true }
      );
    } else {
      const newPlayer = new PlayerModel(data);
      await newPlayer.save();
    }
  } catch (error) {
    console.log("couldn't store/save player in database");
    throw error;
  }
}