Object.defineProperty(StructureSpawn.prototype, "isFull", {
  get: function() {
    return !this.store.getFreeCapacity();
  },
  enumerable: false,
  configurable: false
});