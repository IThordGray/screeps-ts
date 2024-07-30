import { Hauler } from "../../creeps/creeps/Hauler";

StructureSpawn.prototype.spawnHauler = function(budget: number, memory: HaulerMemory) {
  if (!!this.spawning) return ERR_BUSY;
  const creep = new Hauler(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};