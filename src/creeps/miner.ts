import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/base-creep";
import { IMemoryCanHarvest } from "../units-of-work/harvest";

export function isMinerMemory(memory: CreepMemory): memory is MinerMemory {
  return memory.role === CreepTypes.miner;
}

export interface MinerMemory extends CreepMemory, IMemoryCanHarvest {
  role: "miner";
}

export type Miner = Creep & { memory: MinerMemory };

class MinerCreep extends BaseCreep {
  override readonly role = CreepTypes.miner;
  override readonly bodyParts = [ WORK, WORK, MOVE ];

  need(budget: number, memory: Partial<MinerMemory>) {
    return { creepType: CreepTypes.miner, budget, memory };
  }

  run(creep: Miner) {
    if (!creep) return;
    const targetId = creep.memory.sourceId;
    creep.tryHarvest({ targetId });
  }

}

export const minerCreep = new MinerCreep();
