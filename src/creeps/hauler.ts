import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/base-creep";
import { COLLECT_STATE, collectStateSwitchAction } from "../helpers/creeps/creep-try-collect.extensions";
import { DELIVER_STATE, deliverStateSwitchAction } from "../helpers/creeps/creep-try-deliver.extensions";
import { CheckState } from "../units-of-work/check-state";

export function isHaulerMemory(memory: CreepMemory): memory is HaulerMemory {
  return memory.role === CreepTypes.hauler;
}

export interface HaulerMemory extends CreepMemory {
  role: "hauler";
  sourceId: Id<Source>;
  collectPos?: RoomPosition;
  dropOffPos?: RoomPosition;
}

export type Hauler = Creep & { memory: HaulerMemory };

class HaulerCreep extends BaseCreep {

  private readonly _checkState = new CheckState({
    [DELIVER_STATE]: {
      condition: creep => creep.isCollecting && creep.store.getFreeCapacity() === 0,
      action: creep => deliverStateSwitchAction(creep)
    },
    [COLLECT_STATE]: {
      condition: creep => creep.isDelivering && creep.store.getUsedCapacity() === 0,
      action: creep => collectStateSwitchAction(creep)
    }
  });

  override readonly role = CreepTypes.hauler;
  override readonly bodyParts = [ CARRY, MOVE ];

  need(budget: number, memory: Partial<HaulerMemory>) {
    return {
      creepType: CreepTypes.hauler,
      budget,
      memory
    };
  }

  run(creep: Hauler) {
    creep.memory.state ??= COLLECT_STATE;
    this._checkState.check(creep);

    if (creep.isDelivering) {
      const dropOffPos = creep.memory.dropOffPos;
      creep.tryDeliver({ pos: dropOffPos });
    }

    if (creep.isCollecting) {
      const collectPos = creep.memory.collectPos;
      creep.tryCollect({ pos: collectPos });
    }
  }
}

export const haulerCreep = new HaulerCreep();
