interface TryHarvestRoomOptions {
  target: Source | Mineral | Deposit;
}

interface TryHarvestRemoteRoomOptions extends Partial<RemoteOptions> {
  targetId: Id<Source> | Id<Mineral> | Id<Deposit>;
}

type TryHarvestOptions = TryHarvestRoomOptions | TryHarvestRemoteRoomOptions;