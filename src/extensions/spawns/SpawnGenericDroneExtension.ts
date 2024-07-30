import { GenericDrone } from "../../creeps/creeps/GenericDrone";

StructureSpawn.prototype.spawnGenericDrone = function(budget: number, memory: GenericDroneMemory) {
  if (!!this.spawning) return ERR_BUSY;
  const creep = new GenericDrone(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};