export class CreepSourceAllocationMap {
  private _creepSourceAllocationMap = new Map();
  private _sourceCreepAllocationMap = new Map();

  getCreepName(sourceId: string) {
    return this._sourceCreepAllocationMap.get(sourceId);
  }

  getSourceId(creepName: string) {
    return this._creepSourceAllocationMap.get(creepName);
  }

  setCreepName(sourceId: string, creepName: string | undefined) {
    this._sourceCreepAllocationMap.set(sourceId, creepName);
    this._creepSourceAllocationMap.set(creepName, sourceId);
  }

  setSourceId(creepName: string, sourceId: string | undefined) {
    this._creepSourceAllocationMap.set(creepName, sourceId);
    this._sourceCreepAllocationMap.set(sourceId, creepName);
  }
}
