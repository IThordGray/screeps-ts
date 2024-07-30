interface StructureSpawn {
  isFull: boolean;
  isEmpty: boolean;
  hasSpawnRequests: boolean;

  spawnGenericDrone(budget: number, memory: GenericDroneMemory): ScreepsReturnCode;
  spawnHauler(budget: number, memory: HaulerMemory): ScreepsReturnCode;
  spawnMiner(budget: number, memory: MinerMemory): ScreepsReturnCode;
  spawnScout(budget: number, memory: ScoutMemory): ScreepsReturnCode;
}