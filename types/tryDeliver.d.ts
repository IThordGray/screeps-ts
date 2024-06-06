interface TryDeliverOptions {
  pos?: RoomPosition; // Drop off to any available object within a specific range of the position
  targetId?: Id<AnyCreep> | Id<Structure>;
  target?: AnyCreep | Structure;
  dumpRange?: number; // Works with position is no target is set.
  resource?: ResourceConstant;
  amount?: number;
}