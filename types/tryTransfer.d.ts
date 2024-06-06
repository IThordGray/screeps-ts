interface TryTransferOptions {
  pos?: RoomPosition;
  targetId?: Id<AnyCreep> | Id<Structure>;
  resource?: ResourceConstant;
  amount?: number;
  target?: AnyCreep | Structure;
}