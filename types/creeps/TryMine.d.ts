type TryMineReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES;

interface TryMineOptions {
  pos: RoomPosition;
  target?: Source | Mineral | Deposit;
  targetId?: Id<Source> | Id<Mineral> | Id<Deposit>;
}