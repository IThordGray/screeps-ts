import { CreepTypes } from "../abstractions/creep-types";
import { DroneMemory } from "../creeps/drone";
import { RoomState } from "../singletons/game-state";
import { Task } from "./task";
import { TaskPriority } from "./taskPriority";

export class TaskAllocator {

  private readonly _roomState = RoomState.get(this._room.name);

  private _unallocatedCreeps: string[] = [];
  private _allocatedTasks: { [taskId: string]: Task } = {};
  private _creepTaskAllocationMap: { [creepName: string]: string } = {};
  private _taskCreepAllocationMap: { [taskId: string]: string } = {};

  private _allocatedTasksPerPriority: { [key in TaskPriority]: string[] } = {
    [TaskPriority.low]: [],
    [TaskPriority.medium]: [],
    [TaskPriority.high]: []
  };

  readonly getAllocatedDrones = () => Array.from(Object.keys(this._creepTaskAllocationMap)).map(x => Game.creeps[x]);
  readonly getUnallocatedDrones = () => this._unallocatedCreeps.map(x => Game.creeps[x]);

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

    const genericDrones = this._roomState.getCreepState(CreepTypes.genericDrone);
    const drones = [ ...genericDrones ];
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