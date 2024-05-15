import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { gameState } from "singletons/game-state";
import { Collect } from "units-of-work/collect";
import { Deliver } from "units-of-work/deliver";
import { CheckState } from "../units-of-work/check-state";

export function isHaulerMemory(memory: CreepMemory): memory is HaulerMemory {
  return memory.role === CreepTypes.hauler;
}

export interface HaulerMemory extends CreepMemory {
  role: "hauler";
  target: Id<Source>;
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

  private readonly _collect = new Collect({
    getTarget: (creep: Creep) => {
      if (!isHaulerMemory(creep.memory)) return null;

      const source = new Source(gameState.sources[creep.memory.target].id);
      if (!source) return null;

      return source.pos;
    }
  });

  override readonly role = CreepTypes.hauler;
  override readonly bodyParts = [ CARRY, MOVE ];

  run(creep: Creep) {
    creep.memory.state ??= Collect.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Collect.state) this._collect.run(creep);
  }
}

export const haulerCreep = new HaulerCreep();
