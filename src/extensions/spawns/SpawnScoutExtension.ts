StructureSpawn.prototype.spawnMiner = function(budget: number, memory: MinerMemory) {
  const creep = new Miner(budget, memory);
  return this.spawnCreep(creep.body, creep.name, { memory: creep.memory });
};