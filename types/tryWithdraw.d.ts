interface TryWithdrawOptions {
  pos?: RoomPosition;
  targetId?: Id<Structure> | Id<Tombstone> | Id<Ruin>;
  resource?: ResourceConstant;
  amount?: number;
  target?: Structure | Tombstone | Ruin;
}