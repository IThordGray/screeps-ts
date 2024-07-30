import { Scout } from "../../creeps/creeps/Scout";

StructureSpawn.prototype.spawnScout = function(budget: number, memory: ScoutMemory) {
  if (!!this.spawning) return ERR_BUSY;
  const creep = new Scout(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};