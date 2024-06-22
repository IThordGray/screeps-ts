type TryDropReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES

interface TryDropOptions {
  pos?: RoomPosition;
  resource?: ResourceConstant;
  amount?: number;
}