import { CreepTypes } from "abstractions/creep-types";
import { Milestone } from "classes/milestone";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";

export class DroneMilestone extends Milestone {
  condition(): boolean {
    const drones = gameState.getCreepCount(CreepTypes.drone);
    return !!drones;
  }

  run(): void {
    const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;
    spawner.spawnDrone(availableEnergy);
  }
}
