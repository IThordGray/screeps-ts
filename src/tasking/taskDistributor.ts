import { DroneMemory } from "../creeps/generic-drone";
import { Task } from "./task";
import { TaskPriority } from "./taskPriority";
import { TaskTypes } from "./taskTypes";

export class TaskDistributor {

  private readonly _priorityCostsMap = {
    [TaskPriority.high]: 150,
    [TaskPriority.medium]: 75,
    [TaskPriority.low]: 0
  };

  private readonly _taskPriorityCostMap = {
    [TaskTypes.harvest]: 80,
    [TaskTypes.haul]: 60,
    [TaskTypes.repair]: 40,
    [TaskTypes.stationaryUpgrade]: 30,
    [TaskTypes.upgrade]: 30,
    [TaskTypes.stationaryBuild]: 30,
    [TaskTypes.build]: 30,
    [TaskTypes.scout]: 10
  };

  private taskCompareFn = (a: Task, b: Task) => {
    const aCost = this._priorityCostsMap[a.priority] + this._taskPriorityCostMap[a.type];
    const bCost = this._priorityCostsMap[b.priority] + this._taskPriorityCostMap[b.type];
    return bCost - aCost;
  };

  constructor(
    private readonly _room: Room
  ) {
  }

  private assignDroneToTask(drone: Creep, task: Task) {
    const memory = drone.memory as DroneMemory;
    memory.task = task;
  }

  private calculateDroneSuitability(drone: Creep, task: Task) {
    let score = 0;
    let memory = drone.memory as DroneMemory;

    if (task.type === TaskTypes.harvest) {
    }

    if (task.type === TaskTypes.upgrade) {
    }

    if (task.type === TaskTypes.build) {
    }

    if (task.type === TaskTypes.stationaryUpgrade) {
      score += (drone.memory as DroneMemory).task?.type === TaskTypes.upgrade ? 60 : 0;
    }

    if (task.type === TaskTypes.stationaryBuild) {
      score += (drone.memory as DroneMemory).task?.type === TaskTypes.build ? 60 : 0;
    }

    if (task.type === TaskTypes.repair) {
    }

    // Prefer unallocated creeps
    score -= !!memory.task ? 20 : 0;

    return score;
  }

  private findBestDroneForTask(task: Task, drones: Creep[]): Creep | undefined {
    let bestDrone: Creep | undefined;
    let bestScore = -Infinity;

    for (const drone of drones) {
      if (!drone) continue;
      const score = this.calculateDroneSuitability(drone, task);
      if (score > bestScore) {
        bestScore = score;
        bestDrone = drone;
      }
    }

    return bestDrone;
  }

  run() {
    const tasks = [ ...this._room.owned.stratManager.getCurrentStrat().taskNeeds ];
    tasks.sort(this.taskCompareFn)

    const unallocatedDrones = this._room.owned.state.taskState.getUnallocatedDrones();
    const allocatedDrones = this._room.owned.state.taskState.getAllocatedDrones();

    const canReassign = tasks.length > unallocatedDrones.length;
    const drones = canReassign ? [ ...allocatedDrones, ...unallocatedDrones ] : unallocatedDrones;

    for (let i = 0; i < Math.min(drones.length, tasks.length); i++) {
      const task = tasks[i];
      const drone = this.findBestDroneForTask(task, drones);
      if (!drone) continue;

      this.assignDroneToTask(drone, task);
    }
  }
}