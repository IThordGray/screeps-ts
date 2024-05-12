// Tasks are decided based on the current strat.
// Each cycle a tasks is ignored, the prio goes up.

import { uniqueId } from "lodash";

// A creep is more likely to pick up a task with higher prio.
export abstract class Task {
  id = uniqueId();
  priority = 0;

  abstract run(...args: any[]): void;
}

export abstract class CreepTask extends Task {
  creepLimit = 1;

  abstract run(creep: Creep): void;
}

export abstract class StratTask extends Task {

}

export class DroneHarvest {
  harvestDestination!: Source;
  dropoffDestination!: StructureLink;

  busy: boolean = false;

  run(creep: Creep) {
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
  }
}
