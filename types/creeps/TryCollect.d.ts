type TryCollectReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | TryWithdrawReturnCode
  | TryPickupReturnCode

type TryCollectOptions = {
  pos?: RoomPosition;
  targetId?: Id<Structure> | Id<Tombstone> | Id<Ruin> | Id<Resource>;
  resource?: ResourceConstant;
  amount?: number;
  target?: Structure | Tombstone | Ruin | Resource;
  scavengeRange?: number
}
