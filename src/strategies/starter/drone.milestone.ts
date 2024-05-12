import { CreepTypes } from "abstractions/creep-types";
import { Milestone } from "classes/milestone";
import { HarvestTask } from "creep-tasks/harvest.task";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { taskDistributor } from "singletons/task-distributor";

export class DroneMilestone extends Milestone {
  constructor() {
    super();
  }

  condition(...args: any[]): boolean {
    const drones = gameState.getCreepCount(CreepTypes.drone);
    return !!drones;
  }

  init(): void {
    taskDistributor.addTask(new HarvestTask());
  }

  run(...args: any[]): void {
    const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;
    spawner.spawnDrone(availableEnergy);
  }
}
