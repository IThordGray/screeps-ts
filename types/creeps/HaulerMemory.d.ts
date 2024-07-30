type HaulerMemory = CreepMemory & {
  sourceId: Id<Source>;
  targetId?: Id<AnyCreep> | Id<Structure>;
  collectPos?: RoomPosition;
  dropOffPos?: RoomPosition;
};

type HaulerCreep = Creep & {
  memory: HaulerMemory;
}