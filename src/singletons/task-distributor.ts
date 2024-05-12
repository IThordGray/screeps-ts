import { CreepTask, StratTask, Task } from "classes/task";
import { isDroneMemory } from "creeps/drone";
import { gameState } from "./game-state";
import { CreepTypes } from "abstractions/creep-types";

/**
 * Distribute high priority tasks amongst creeps.
 * Keep references to which creeps are currently doing which tasks.
 */
class TaskDistributor {

  private _stratTasks: StratTask[] = [];
  private _stratTaskMap: { [taskId: string]: StratTask } = {};

  private _creepTasks: CreepTask[] = [];
  private _creepTaskMap: { [taskId: string]: CreepTask } = {};

  private _creepTaskAllocationMap: { [creepName: string]: string } = {};
  private _taskCreepAllocationMap: { [taskId: string]: string[] } = {};

  update(...args: any[]) {
    const viableCreeps: Creep[] = [];
    this._creepTaskAllocationMap = {};
    this._taskCreepAllocationMap = {};

    _.forEach(Game.creeps, creep => {
      if (!isDroneMemory(creep.memory)) return;

      if (!creep.memory.taskId) {
        viableCreeps.push(creep);
        return;
      }

      this._creepTaskAllocationMap[creep.name] = creep.memory.taskId;
      this._taskCreepAllocationMap[creep.memory.taskId] ??= [];
      this._taskCreepAllocationMap[creep.memory.taskId].push(creep.name);
    });

    if (!viableCreeps.length) return;

    for (const task of this._creepTasks) {
      const allocatedCreeps = this._taskCreepAllocationMap[task.id];
      if (allocatedCreeps?.length ?? 0 >= task.creepLimit) continue;

      const creep = viableCreeps.shift();
      // No more viable creeps exist.
      if (!creep) return;

      this._creepTaskAllocationMap[creep.name] = task.id;
      this._taskCreepAllocationMap[task.id] ??= [];
      this._taskCreepAllocationMap[task.id].push(creep.name);
    }
  }

  run(...args: any[]) {
    // This is wrong. Need to look ask for all taskable drones instead.
    const drones = gameState.creeps[CreepTypes.drone]?.refs;
    if(!drones?.length) return;

    drones.forEach(drone => {
      if (!isDroneMemory(drone.memory)) return;

      const allocation = this._creepTaskAllocationMap[drone.name];
      drone.memory.taskId = allocation;
    });
  }

  removeCreepTasks(cb: (task: CreepTask) => boolean) {
    for (let i = this._creepTasks.length - 1; i >= 0; i--) {
      const task = this._creepTasks[i];
      const shouldRemove = cb(task);
      if (!shouldRemove) continue;

      this._creepTasks.splice(i, 1);
      delete this._creepTaskMap[task.id];
    }
  }

  removeStratTasks(cb: (task: StratTask) => boolean) {
    for (let i = this._stratTasks.length - 1; i >= 0; i--) {
      const task = this._stratTasks[i];
      const shouldRemove = cb(task);
      if (!shouldRemove) continue;

      this._stratTasks.splice(i, 1);
      delete this._stratTaskMap[task.id];
    }
  }

  addTask(task: Task) {
    if (task instanceof CreepTask) {
      this._creepTasks.push(task);
      this._creepTaskMap[task.id] = task;
      return;
    }

    if (task instanceof StratTask) {
      this._stratTasks.push(task);
      this._stratTaskMap[task.id] = task;
      return;
    }
  }

  deleteTask(task: Task) {
    if (task instanceof CreepTask) {
      this._creepTasks = this._creepTasks.filter(x => x !== task);
      delete this._creepTaskMap[task.id];
    }

    if (task instanceof StratTask) {
      this._stratTasks = this._stratTasks.filter(x => x !== task);
      delete this._stratTaskMap[task.id];
    }
  }

  getCreepTask(taskId: string): CreepTask | undefined {
    return this._creepTaskMap[taskId];
  }

  getStratTask(): StratTask | undefined {
    return this._stratTasks.shift();
  }
}

export const taskDistributor = new TaskDistributor();
