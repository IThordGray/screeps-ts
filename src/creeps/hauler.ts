import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { gameState } from "singletons/game-state";
import { CheckWorking } from "units-of-work/check-state";
import { Collect } from "units-of-work/collect";
import { Deliver } from "units-of-work/deliver";

export function isHaulerMemory(memory: CreepMemory): memory is HaulerMemory {
  return memory.role === CreepTypes.hauler;
}

export interface HaulerMemory extends CreepMemory {
  role: "hauler";
  target: Id<Source>;
}

class HaulerCreep extends BaseCreep {
  private readonly _checkWorking = new CheckWorking({
    isWorkingAnd: (creep: Creep) => creep.store[RESOURCE_ENERGY] === 0,
    notWorkingAction: (creep: Creep) => Collect.action(creep),
    isNotWorkingAnd: (creep: Creep) => creep.store.getFreeCapacity() === 0,
    workingAction: (creep: Creep) => Deliver.action(creep)
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

      return source;
    }
  });

  override readonly role = CreepTypes.hauler;
  override readonly bodyParts = [ CARRY, MOVE ];

  run(creep: Creep) {
    this._checkWorking.run(creep);

    creep.memory.working
      ? this._deliver.run(creep)
      : this._collect.run(creep);
  }
}

export const haulerCreep = new HaulerCreep();
