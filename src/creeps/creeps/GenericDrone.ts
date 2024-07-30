import { CreepTypes } from "../../abstractions/CreepTypes";
import { BaseTask, TaskExecutorLoader } from "../../tasking/BaseTask";
import { DoTask } from "../../units-of-work/doTask";
import { BaseCreep, CreepExecutor, CreepExecutorLoader } from "../BaseCreep";

export type GenericDroneCreep = Creep & { memory: GenericDroneMemory };

export class GenericDroneNeed {
  readonly creepType = CreepTypes.genericDrone;
  constructor(
    public readonly budget: number,
    public readonly memory?: Partial<GenericDroneMemory>
  ) { }
}

export class GenericDrone extends BaseCreep {
  constructor(budget: number, memory: GenericDroneMemory) {
    super(CreepTypes.genericDrone, [ MOVE, WORK, CARRY ], budget, memory);
  }
}

export class GenericDroneCreepExecutor extends CreepExecutor<GenericDroneCreep> {
  private readonly _doTask = new DoTask({
    getTask: (creep: Creep) => (creep.memory as GenericDroneMemory).task,
    getTaskExecutor: (task: BaseTask) => TaskExecutorLoader.get(task)
  });

  run(): void {
    if (!this.creep) return;
    this._doTask.run(this.creep);
  }
}

CreepExecutorLoader.register(CreepTypes.genericDrone, GenericDroneCreepExecutor);
