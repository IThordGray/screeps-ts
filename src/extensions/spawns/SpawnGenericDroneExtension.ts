StructureSpawn.prototype.spawnScout = function(budget: number, memory: ScoutMemory) {
  const creep = new Scout(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};