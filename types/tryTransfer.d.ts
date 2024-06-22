type TryTransferReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | ScreepsReturnCode

interface TryTransferOptions {
  pos?: RoomPosition;
  targetId?: Id<AnyCreep> | Id<Structure>;
  resource?: ResourceConstant;
  amount?: number;
  target?: AnyCreep | Structure;
}