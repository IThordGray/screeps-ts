import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { Task } from "../tasking/task";
import { TaskExecutorLoader } from "../tasking/taskExecutorLoader";
import { DoTask, IMemoryCanDoTask } from "../units-of-work/doTask";

export function isDroneMemory(memory: CreepMemory): memory is DroneMemory {
  return memory.role === CreepTypes.genericDrone;
}

export interface DroneMemory extends CreepMemory, IMemoryCanDoTask {
  role: "drone";
}

class GenericDroneCreep extends BaseCreep {

  private readonly _doTask = new DoTask({
    getTask: (creep: Creep) => (creep.memory as DroneMemory).task,
    getTaskExecutor: (task: Task) => TaskExecutorLoader.get(task)
  });

  override readonly role: string = CreepTypes.genericDrone;
  override readonly bodyParts: BodyPartConstant[] = [ MOVE, WORK, CARRY ];

  need(budget: number, memory: Partial<DroneMemory>) {
    return {
      creepType: CreepTypes.genericDrone,
      budget,
      memory
    };
  }

  run(creep: Creep): void {
    if (!creep) return;
    this._doTask.run(creep);
  }
}

export const genericDroneCreep = new GenericDroneCreep();
