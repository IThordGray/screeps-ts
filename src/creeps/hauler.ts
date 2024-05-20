import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { Collect, IMemoryCanCollect } from "units-of-work/collect";
import { Deliver, IMemoryCanDeliver } from "units-of-work/deliver";
import { CheckState } from "../units-of-work/check-state";

export function isHaulerMemory(memory: CreepMemory): memory is HaulerMemory {
  return memory.role === CreepTypes.hauler;
}

export interface HaulerMemory extends CreepMemory, IMemoryCanCollect, IMemoryCanDeliver {
  role: "hauler";
  sourceId: Id<Source>;
}

class HaulerCreep extends BaseCreep {

  private readonly _checkState = new CheckState({
    [Deliver.state]: {
      condition: creep => creep.memory.state === Collect.state && creep.store.getFreeCapacity() === 0,
      action: creep => Deliver.action(creep)
    },
    [Collect.state]: {
      condition: creep => creep.memory.state === Deliver.state && creep.store.getUsedCapacity() === 0,
      action: creep => Collect.action(creep)
    }
  });

  private readonly _deliver = new Deliver({
    getPosition: (creep: Creep) => {
      const { x, y, roomName } = (creep.memory as HaulerMemory).dropOffPos;
      return new RoomPosition(x, y, roomName);
    },
    getTarget: creep => Deliver.defaultTarget(creep)
  });

  private readonly _collect = new Collect({
    getPosition: (creep: Creep) => {
      const { x, y, roomName } = (creep.memory as HaulerMemory).collectPos;
      return new RoomPosition(x, y, roomName);
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

  run(creep: Creep) {
    creep.memory.state ??= Collect.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Collect.state) this._collect.run(creep);
  }
}

export const haulerCreep = new HaulerCreep();
