import { CreepTypes } from "../../abstractions/CreepTypes";
import { BaseCreep, CreepExecutor, CreepExecutorLoader } from "../BaseCreep";

export type MinerCreep = Creep & { memory: MinerMemory };

export class MinerNeed {
  readonly creepType = CreepTypes.miner;

  constructor(
    public readonly budget: number,
    public readonly memory?: Partial<MinerMemory>
  ) { }
}

export class Miner extends BaseCreep {
  constructor(budget: number, memory: MinerMemory) {
    super(CreepTypes.miner, [ WORK, WORK, MOVE ], budget, memory);
  }
}

export class MinerCreepExecutor extends CreepExecutor<MinerCreep> {
  run(): void {
    this.creep.tryMine({ targetId: this.creep.memory.sourceId, pos: this.creep.memory.pos });
  }
}

CreepExecutorLoader.register(CreepTypes.miner, MinerCreepExecutor);