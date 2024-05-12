import { CreepTypes } from "abstractions/creep-types";
import { Milestone } from "classes/milestone";
import { HarvestTask } from "creep-tasks/harvest.task";
import { getAdjacentRoomNames } from "helpers/get-adjacent-room-names";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { taskDistributor } from "singletons/task-distributor";

export class InitialScoutingMilestone extends Milestone {

  private _roomIds: string[] = [];

  constructor() {
    super();

    const homeSpawn = gameState.homeSpawn;
    const { north, south, east, west } = getAdjacentRoomNames(homeSpawn.room.name);
    const { north: northWest, south: southWest } = getAdjacentRoomNames(west);
    const { north: northEast, south: southEast } = getAdjacentRoomNames(east);

    this._roomIds.push(north, northEast, east, southEast, south, southWest, west, northWest);
  }

  condition(...args: any[]): boolean {
    return this._roomIds.every(x => !!gameState.scoutedRooms[x]);
  }

  init(): void {
    taskDistributor.removeCreepTasks(task => task instanceof HarvestTask);
  }

  run(...args: any[]): void {
    const scouts = gameState.creeps[CreepTypes.scout];
    const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;

    if (!scouts) spawner.spawnScout(availableEnergy, this._roomIds);
  }

}
