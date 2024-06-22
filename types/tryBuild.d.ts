type TryBuildReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH

interface TryBuildOptions {
  pos?: RoomPosition;
  target?: ConstructionSite;
  targetId?: Id<ConstructionSite>;
}