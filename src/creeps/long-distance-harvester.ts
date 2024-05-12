import { CheckWorking } from "units-of-work/check-state";
import { CreepTypes } from "abstractions/creep-types";
import { Deliver } from "units-of-work/deliver";
import { Harvest } from "units-of-work/harvest";
import { BaseCreep } from "classes/base-creep";
import { LDHarvest } from "units-of-work/ld-harvest";
import { gameState } from "singletons/game-state";

export function isLDHMemory(memory: CreepMemory): memory is LDHMemory {
    return memory.role === CreepTypes.ldh;
}

export interface LDHMemory extends CreepMemory {
    role: 'ldh';
    target: Id<Source>;
}

class LDHCreep extends BaseCreep {
    override role = CreepTypes.ldh;
    override bodyParts: BodyPartConstant[] = [WORK, CARRY, CARRY, MOVE, MOVE];

    private readonly _checkWorking = new CheckWorking({
        isWorkingAnd: (creep: Creep) => creep.store[RESOURCE_ENERGY] === 0,
        notWorkingAction: (creep: Creep) => Harvest.action(creep),
        isNotWorkingAnd: (creep: Creep) => creep.store.getFreeCapacity() === 0,
        workingAction: (creep: Creep) => Deliver.action(creep),
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

    private readonly _ldHarvest = new LDHarvest({
        getTarget: (creep: Creep) => {
            if (!isLDHMemory(creep.memory)) return null;
            const source = gameState.sources[creep.memory.target];
            if (!source) return null;
            return { pos: source.pos, sourceId: creep.memory.target };
        }
    });

    run(creep: Creep): void {
        this._checkWorking.run(creep);

        creep.memory.working
            ? this._ldHarvest.run(creep)
            : this._deliver.run(creep);
    }

}

export const ldHarvesterCreep = new LDHCreep();


