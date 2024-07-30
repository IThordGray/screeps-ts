import { Miner } from "../../creeps/creeps/Miner";

StructureSpawn.prototype.spawnMiner = function(budget: number, memory: MinerMemory) {
  if (!!this.spawning) return ERR_BUSY;
  const creep = new Miner(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};