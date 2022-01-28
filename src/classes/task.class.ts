export interface ITask {
  run: (creep: Creep) => void;
}

export class DroneHarverst implements ITask {
  harvestDestination!: Source;
  dropoffDestination!: StructureLink;

  busy: boolean = false;

  run: (creep: Creep) => void = (creep: Creep) => {
    if (this.busy && creep.store.energy === 0) {
      this.busy = false;
    } else if (!this.busy && creep.store.energy === creep.store.getCapacity()) {
      this.busy = true;
    }

    if (this.busy) {
      const result = creep.transfer(this.dropoffDestination, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) creep.moveTo(this.dropoffDestination);
    } else {
      const result = creep.harvest(this.harvestDestination);
      if (result === ERR_NOT_IN_RANGE) creep.moveTo(this.harvestDestination);
    }
  };
}

// The creepId is married to the Task, which lives in the heap.
// When the strategy runs, it checks whether the creep alread
