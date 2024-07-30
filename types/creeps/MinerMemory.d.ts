type MinerMemory = CreepMemory & {
  pos: RoomPosition;
  sourceId: Id<Source>;
};

type MinerCreep = Creep & {
  memory: MinerMemory;
}