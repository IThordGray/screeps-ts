import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { gameState } from "singletons/game-state";
import { Deliver } from "units-of-work/deliver";
import { Harvest } from "units-of-work/harvest";
import { LDHarvest } from "units-of-work/ld-harvest";
import { CheckState } from "../units-of-work/check-state";

export function isLDHMemory(memory: CreepMemory): memory is LDHMemory {
  return memory.role === CreepTypes.ldh;
}

export interface LDHMemory extends CreepMemory {
  role: "ldh";
  target: Id<Source>;
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
    getTarget: (creep: Creep) => {
      let targets = gameState.homeSpawn.room.find(FIND_STRUCTURES, {
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

  private readonly _ldHarvest = new LDHarvest({
    getTarget: (creep: Creep) => {
      if (!isLDHMemory(creep.memory)) return null;
      const source = gameState.sources[creep.memory.target];
      if (!source) return null;
      return { pos: source.pos, sourceId: creep.memory.target };
    }
  });

  override readonly role = CreepTypes.ldh;
  override readonly bodyParts: BodyPartConstant[] = [ WORK, CARRY, CARRY, MOVE, MOVE ];

  run(creep: Creep): void {
    creep.memory.state ??= Harvest.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Harvest.state) this._ldHarvest.run(creep);
  }
}

export const ldHarvesterCreep = new LDHCreep();


