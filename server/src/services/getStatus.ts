import { StatusInterface, StatusModel } from "../models/status";
import { ApiResponse } from "@shared-types/types";

export async function getStatusDatabase(name: string): Promise<ApiResponse<StatusInterface>> {
  const player = await StatusModel.findOne(
    { username: name },
    null,
    { collation: { locale: "en", strength: 2 } }
  );
  if (!player) {
    return {
      success: false,
      error: {
        message: "The player is not in the database, please call on the hypixel api",
        code: "INVALID_PLAYER"
      }
    };
  }
  return {
    success: true,
    data: player
  };
}