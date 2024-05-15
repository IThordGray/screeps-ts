import { CreepTask } from "classes/task";
import { Deliver } from "units-of-work/deliver";
import { Harvest } from "units-of-work/harvest";
import { CheckState } from "../units-of-work/check-state";

export class HarvestTask extends CreepTask {

  private readonly _checkState = new CheckState({
    [Deliver.state]: {
      condition: creep => creep.memory.state === Harvest.state && creep.store.getFreeCapacity() === 0,
      action: creep => Deliver.action(creep)
    },
    [Harvest.state]: {
      condition: creep => creep.memory.state === Deliver.state && creep.store.getUsedCapacity() === 0,
      action: creep => Harvest.action(creep)
    }
  });

  private readonly _harvest = new Harvest({
    getTarget: (creep: Creep) => creep.pos.findClosestByPath(FIND_SOURCES)
  });

  private readonly _deliver = new Deliver({
    getTarget: (creep: Creep) => {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      return targets[0];
    }
  });

  run(creep: Creep) {
    creep.memory.state ??= Harvest.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Harvest.state) this._harvest.run(creep);
  }
}
