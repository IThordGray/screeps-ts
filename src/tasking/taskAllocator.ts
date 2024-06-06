import { CreepTypes } from "../abstractions/creep-types";
import { DroneMemory } from "../creeps/generic-drone";
import { IMemoryCanDoTask } from "../units-of-work/doTask";
import { Task } from "./task";
import { TaskPriority } from "./taskPriority";
import { TaskType } from "./taskType";

export class TaskAllocator {

  private _unallocatedCreeps: string[] = [];
  private _allocatedTasks: { [taskId: string]: Task } = {};
  private _creepTaskAllocationMap: { [creepName: string]: string } = {};
  private _taskCreepAllocationMap: { [taskId: string]: string } = {};
  private _allocatedTasksPerPriority: { [key in TaskPriority]: string[] } = {
    [TaskPriority.low]: [],
    [TaskPriority.medium]: [],
    [TaskPriority.high]: []
  };
  readonly getAllocatedDrones = (taskType?: TaskType) => {
    const creeps: Creep[] = [];
    Array.from(Object.keys(this._creepTaskAllocationMap)).forEach(x => {
      const creep = Game.creeps[x];
      if (!creep) return; // Creep died for some reason.
      const memory = creep.memory as CreepMemory & IMemoryCanDoTask;

      if (taskType && memory.task.type !== taskType) return;
      creeps.push(creep);
    });

    return creeps;
  };
  readonly getUnallocatedDrones = () => this._unallocatedCreeps.map(x => Game.creeps[x]);

  private get _roomState() {
    return this._room.owned.state;
  }

  constructor(
    private readonly _room: Room
  ) {
  }

  private allocateExistingTasks() {
    this._unallocatedCreeps = [];
    this._allocatedTasks = {};
    this._creepTaskAllocationMap = {};
    this._taskCreepAllocationMap = {};
    this._allocatedTasksPerPriority = { [TaskPriority.low]: [], [TaskPriority.medium]: [], [TaskPriority.high]: [] };

    const drones = this._roomState.creepState.getCreeps(CreepTypes.genericDrone);
    if (!drones.length) return;

    drones.forEach(creep => {
      const memory = creep.memory as DroneMemory;
      if (!memory.task) {
        this._unallocatedCreeps.push(creep.name);
        return;
      }

      this._allocatedTasks[memory.task.id] = memory.task;
      this._creepTaskAllocationMap[creep.name] = memory.task.id;
      this._taskCreepAllocationMap[memory.task.id] = creep.name;
      this._allocatedTasksPerPriority[memory.task.priority].push(memory.task.id);
    });
  }

  update() {
    this.allocateExistingTasks();
  }
}