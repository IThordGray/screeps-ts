import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { Harvest, IMemoryCanHarvest } from "units-of-work/harvest";

export function isMinerMemory(memory: CreepMemory): memory is MinerMemory {
  return memory.role === CreepTypes.miner;
}

export interface MinerMemory extends CreepMemory, IMemoryCanHarvest {
  role: "miner";
}

class MinerCreep extends BaseCreep {
  private readonly _harvest = new Harvest({
    getPosition: (creep: Creep) => (creep.memory as MinerMemory).pos,
    getTarget: (creep: Creep) => new Source((creep.memory as MinerMemory).sourceId)
  });

  override readonly role = CreepTypes.miner;
  override readonly bodyParts = [ WORK, WORK, MOVE ];

  need(budget: number, memory: Partial<MinerMemory>) {
    return { creepType: CreepTypes.miner, budget, memory };
  }

  run(creep: Creep) {
    if (!creep) return;
    this._harvest.run(creep);
  }

}

export const minerCreep = new MinerCreep();
