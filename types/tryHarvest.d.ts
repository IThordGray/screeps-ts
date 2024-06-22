type TryHarvestReturnCode =
  | CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
  | CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES

interface TryHarvestRoomOptions {
  target: Source | Mineral | Deposit;
}

interface TryHarvestRemoteRoomOptions extends Partial<RemoteOptions> {
  targetId: Id<Source> | Id<Mineral> | Id<Deposit>;
}

type TryHarvestOptions = TryHarvestRoomOptions | TryHarvestRemoteRoomOptions;