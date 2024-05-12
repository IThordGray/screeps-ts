import { CreepTask } from "classes/task";
import { CheckWorking } from "units-of-work/check-state";
import { Deliver } from "units-of-work/deliver";
import { Harvest } from "units-of-work/harvest";

export class HarvestTask extends CreepTask {

  private readonly _checkWorking = new CheckWorking({
    isWorkingAnd: (creep: Creep) => creep.store[RESOURCE_ENERGY] === 0,
    workingAction: (creep: Creep) => Deliver.action(creep),
    isNotWorkingAnd: (creep: Creep) => creep.store.getFreeCapacity() === 0,
    notWorkingAction: (creep: Creep) => Harvest.action(creep)
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
    this._checkWorking.run(creep);

    creep.memory.working
      ? this._deliver.run(creep)
      : this._harvest.run(creep);
  }
}
