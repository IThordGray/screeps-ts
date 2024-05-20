import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/base-creep";
import { CheckState } from "../units-of-work/check-state";
import { Deliver } from "../units-of-work/deliver";
import { Harvest } from "../units-of-work/harvest";
import { LDHMemory } from "./ldh";

class Harvester extends BaseCreep {
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

  private readonly _deliver = new Deliver({
    getPosition: (creep: Creep) => (creep.memory as LDHMemory).dropOffPos,
    getTarget: creep => Deliver.defaultTarget(creep)
  });

  private readonly _harvest = new Harvest({
    getPosition: (creep: Creep) => creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)?.pos!,
    getTarget: (creep: Creep) => creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
  });

  role: string = CreepTypes.harvester;
  bodyParts: BodyPartConstant[] = [ WORK, CARRY, MOVE ];

  run(creep: Creep): void {
    creep.memory.state ??= Harvest.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Harvest.state) this._harvest.run(creep);
  }
}

export const harvesterCreep = new Harvester();