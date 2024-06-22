type TryDeliverReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | TryTransferReturnCode
  | TryDropReturnCode

interface TryDeliverOptions {
  pos?: RoomPosition; // Drop off to any available object within a specific range of the position
  targetId?: Id<AnyCreep> | Id<Structure>;
  target?: AnyCreep | Structure;
  dumpRange?: number; // Works with position is no target is set.
  resource?: ResourceConstant;
  amount?: number;
}