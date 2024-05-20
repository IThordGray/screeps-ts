import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { Deliver, IMemoryCanDeliver } from "units-of-work/deliver";
import { Harvest, IMemoryCanHarvest } from "units-of-work/harvest";
import { CheckState } from "../units-of-work/check-state";

export function isLDHMemory(memory: CreepMemory): memory is LDHMemory {
  return memory.role === CreepTypes.ldh;
}

export interface LDHMemory extends CreepMemory, IMemoryCanHarvest, IMemoryCanDeliver {
  role: "ldh";
}

class LDHCreep extends BaseCreep {

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
    getPosition: (creep: Creep) => (creep.memory as LDHMemory).dropOffPos
  });

  private readonly _harvest = new Harvest({
    getPosition: (creep: Creep) => (creep.memory as LDHMemory).pos,
    getTarget: (creep: Creep) => new Source((creep.memory as LDHMemory).sourceId)
  });

  override readonly role = CreepTypes.ldh;
  override readonly bodyParts: BodyPartConstant[] = [ WORK, CARRY, CARRY, MOVE, MOVE ];

  run(creep: Creep): void {
    creep.memory.state ??= Harvest.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Harvest.state) this._harvest.run(creep);
  }
}

export const ldHarvesterCreep = new LDHCreep();


