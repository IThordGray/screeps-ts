type TryPickupReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | CreepActionReturnCode | ERR_FULL

interface TryPickupOptions {
  pos?: RoomPosition;
  target?: Resource;
  targetId?: Id<Resource>;
}