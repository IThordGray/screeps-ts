import { DroneMemory } from "../creeps/drone";
import { RoomState } from "../singletons/game-state";
import { StratManager } from "../singletons/strat-manager";
import { Task } from "./task";
import { TaskAllocator } from "./taskAllocator";
import { TaskPriority } from "./taskPriority";
import { TaskType } from "./taskType";

export class TaskDistributor {

  private readonly _priorityCostsMap = {
    [TaskPriority.high]: 30,
    [TaskPriority.medium]: 20,
    [TaskPriority.low]: 10
  };

  private readonly _taskPriorityCostMap = {
    [TaskType.defend]: 10,
    [TaskType.harvest]: 6,
    [TaskType.haul]: 5,
    [TaskType.repair]: 4,
    [TaskType.build]: 2,
    [TaskType.scout]: 1
  };
  private taskCompareFn = (a: Task, b: Task) => {
    const aCost = this._priorityCostsMap[a.priority] + this._taskPriorityCostMap[a.type];
    const bCost = this._priorityCostsMap[b.priority] + this._taskPriorityCostMap[b.type];
    return bCost - aCost;
  };

  private readonly _roomState = RoomState.get(this._room.name);

  constructor(
    private readonly _room: Room,
    private readonly _taskAllocator: TaskAllocator,
    private readonly _stratManager: StratManager
  ) {
  }

  private assignDroneToTask(drone: Creep, task: Task) {
    const memory = drone.memory as DroneMemory;
    memory.task = task;
  }

  private calculateDroneSuitability(drone: Creep, task: Task) {
    let score = 0;
    let memory = drone.memory as DroneMemory;
    const distance = PathFinder.search(drone.pos, task.pos).cost;

    if (task.type === TaskType.harvest) {
      if (distance < 10) { // Close proximity
        score += drone.body.filter(x => x.type === "work").length * 10;
        score += drone.body.filter(x => x.type === "carry").length * 5;
        score += drone.body.filter(x => x.type === "move").length * 1;
      } else if (drone.pos.roomName === task.pos.roomName) { // Same room
        score += drone.body.filter(x => x.type === "work").length * 8;
        score += drone.body.filter(x => x.type === "carry").length * 8;
        score += drone.body.filter(x => x.type === "move").length * 5;
      } else { // Different room
        score += drone.body.filter(x => x.type === "move").length * 10;
        score += drone.body.filter(x => x.type === "work").length * 5;
        score += drone.body.filter(x => x.type === "carry").length * 3;
      }
    }

    if (task.type === TaskType.build) {
      score += drone.body.filter(x => x.type === "work").length * 10;
      score += drone.body.filter(x => x.type === "carry").length * 5;
      score += drone.body.filter(x => x.type === "move").length * 2;
    }

    if (task.type === TaskType.repair) {
      score += drone.body.filter(x => x.type === "work").length * 10;
      score += drone.body.filter(x => x.type === "carry").length * 5;
      score += drone.body.filter(x => x.type === "move").length * 2;
    }

    // Prefer closer creeps.
    score -= distance;

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
    const tasks = this._stratManager.getCurrentStrat().getTaskRequirements().sort(this.taskCompareFn);
    const unallocatedDrones = this._taskAllocator.getUnallocatedDrones();
    const allocatedDrones = this._taskAllocator.getAllocatedDrones();

    const canReassign = tasks.length > unallocatedDrones.length;
    const drones = canReassign ? [ ...allocatedDrones, ...unallocatedDrones ] : unallocatedDrones;

    for (const task of tasks) {
      const drone = this.findBestDroneForTask(task, drones);
      if (!drone) continue;

      this.assignDroneToTask(drone, task);
    }
  }
}