Object.defineProperty(StructureSpawn.prototype, "hasSpawnRequests", {
  get: function() {
    if (!this.room.owned) return false;
    return !!this.room.owned.stratManager.getCurrentStrat().creepNeeds.length;
  },
  enumerable: false,
  configurable: false
});