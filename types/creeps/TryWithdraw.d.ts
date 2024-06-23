type TryWithdrawReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | ScreepsReturnCode

interface TryWithdrawOptions {
  pos?: RoomPosition;
  targetId?: Id<Structure> | Id<Tombstone> | Id<Ruin>;
  resource?: ResourceConstant;
  amount?: number;
  target?: Structure | Tombstone | Ruin;
}