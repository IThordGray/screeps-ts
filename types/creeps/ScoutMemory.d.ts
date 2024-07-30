type ScoutMemory = CreepMemory & {
  target: RoomPosition | undefined;
  roomNames: string[];
};

type ScoutCreep = Creep & {
  memory: ScoutMemory
}