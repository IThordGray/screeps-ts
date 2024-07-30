Object.defineProperty(StructureSpawn.prototype, "isEmpty", {
  get: function() {
    return !this.store.getUsedCapacity();
  },
  enumerable: false,
  configurable: false
});