import { CreepTypes } from "abstractions/creep-types";
import { Harvest } from "units-of-work/harvest";
import { BaseCreep } from "classes/base-creep";
import { gameState } from "singletons/game-state";

export function isMinerMemory(memory: CreepMemory): memory is MinerMemory {
  return memory.role === CreepTypes.miner;
}

export interface MinerMemory extends CreepMemory {
  role: 'miner';
  target: Id<Source>;
}

class MinerCreep extends BaseCreep {
  override role = CreepTypes.miner;
  override bodyParts = [WORK, WORK, MOVE];

  private readonly _harvest = new Harvest({
    getTarget: (creep: Creep) => {
      if (!isMinerMemory(creep.memory)) return null;
      return new Source(gameState.sources[creep.memory.target].id)
    }
  })

  run(creep: Creep) {
    if (!isMinerMemory(creep.memory)) return;
    this._harvest.run(creep);
  }

}

export const minerCreep = new MinerCreep();
