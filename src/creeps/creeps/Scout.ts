import { CreepTypes } from "../../abstractions/CreepTypes";
import { BaseCreep, CreepExecutor, CreepExecutorLoader } from "../BaseCreep";

export type ScoutCreep = Creep & { memory: ScoutMemory }

export class ScoutNeed {
  readonly creepType = CreepTypes.scout;

  constructor(
    public readonly budget: number,
    public readonly memory?: Partial<ScoutMemory>
  ) { }
}

export class Scout extends BaseCreep {
  constructor(budget: number, memory: ScoutMemory) {
    super(CreepTypes.scout, [ MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ], budget, memory);
  }
}

export class ScoutCreepExecutor extends CreepExecutor<ScoutCreep> {
  run(): void {
  }
}

CreepExecutorLoader.register(CreepTypes.scout, ScoutCreepExecutor);
