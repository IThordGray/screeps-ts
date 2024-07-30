StructureSpawn.prototype.spawnMiner = function(budget: number, memory: MinerMemory) {
  const miner = new Miner(budget, memory);
  return this.spawnCreep(miner.body, miner.name, { memory: miner.memory });
};