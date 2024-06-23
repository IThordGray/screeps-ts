import { CreepTypes } from "../abstractions/creep-types";
import { Task } from "../tasking/Task";
import { TaskPriority } from "../tasking/TaskPriority";
import { IMemoryCanDoTask } from "../units-of-work/doTask";

export class TaskState {

  private _unallocatedCreeps: string[] = [];
  private _allocatedTasks: { [taskId: string]: Task } = {};
  private _creepTaskAllocationMap: { [creepName: string]: string } = {};
  private _taskCreepAllocationMap: { [taskId: string]: string } = {};
  private _allocatedTasksPerPriority: { [key in TaskPriority]: string[] } = {
    [TaskPriority.low]: [],
    [TaskPriority.medium]: [],
    [TaskPriority.high]: []
  };

  readonly getAllocatedDrones = (...taskTypes: TaskType[]) => {
    const creeps: Creep[] = [];
    Array.from(Object.keys(this._creepTaskAllocationMap)).forEach(x => {
      const creep = Game.creeps[x];
      if (!creep) return; // Creep died for some reason.
      const memory = creep.memory as CreepMemory & IMemoryCanDoTask;

      if (taskTypes?.length && !taskTypes.includes(memory.task.type)) return;
      creeps.push(creep);
    });

    return creeps;
  };

  readonly getUnallocatedDrones = () => {
    const creeps: Creep[] = [];
    this._unallocatedCreeps.forEach(x => {
      if (Game.creeps[x]) creeps.push(Game.creeps[x]);
    });
    return creeps;
  };

  constructor(
    public readonly room: Room
  ) {
  }

  allocate(creep: Creep): void {
    if (creep.memory.role !== CreepTypes.genericDrone) return;

    const { task } = creep.memory as { task: Task } & CreepMemory;

    if (task) {
      this._allocatedTasks[task.id] = task;
      this._creepTaskAllocationMap[creep.name] = task.id;
      this._taskCreepAllocationMap[task.id] = creep.name;
      this._allocatedTasksPerPriority[task.priority].push(task.id);
      return;
    }

    this._unallocatedCreeps.push(creep.name);
  }


}