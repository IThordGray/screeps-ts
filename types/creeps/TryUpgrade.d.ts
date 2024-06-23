type TryUpgradeReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | ScreepsReturnCode

interface TryUpgradeOptions {
  pos?: RoomPosition;
  targetId?: Id<StructureController>;
  target?: StructureController;
}