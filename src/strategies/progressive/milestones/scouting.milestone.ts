import { CreepTypes } from "abstractions/creep-types";
import { ICreepRequirements } from "abstractions/interfaces";
import { getAdjacentRoomNames } from "helpers/get-adjacent-room-names";
import { Task } from "tasking/task";
import { scoutCreep } from "../../../creeps/scout";
import { RoomState } from "../../../singletons/game-state";
import { TaskAllocator } from "../../../tasking/taskAllocator";
import { Milestone } from "./milestone";

export class ScoutingMilestone extends Milestone {
  private _creepRequirement: ICreepRequirements | undefined;
  private _taskRequirements: Task[] = [];
  private _roomIds: string[] = [];

  constructor(room: string, taskAllocator: TaskAllocator) {
    super(room, taskAllocator);
    const homeSpawn = RoomState.get(this._roomName).spawn;
    const { north, south, east, west } = getAdjacentRoomNames(homeSpawn.room.name);
    const { north: northWest, south: southWest } = getAdjacentRoomNames(west);
    const { north: northEast, south: southEast } = getAdjacentRoomNames(east);

    this._roomIds.push(north, northEast, east, southEast, south, southWest, west, northWest);
  }

  condition(): boolean {
    return this._roomIds.every(x => !!Memory.scoutedRooms[x]);
  }

  getCreepRequirements(): ICreepRequirements[] {
    return this._creepRequirement ? [ this._creepRequirement ] : [];
  }

  getTaskRequirements(): Task[] {
    return this._taskRequirements;
  }

  update(): void {
    const scouts = RoomState.get(this._roomName).getCreepState(CreepTypes.scout);
    const availableEnergy = RoomState.get(this._roomName).room.energyCapacityAvailable;

    if (!scouts) this._creepRequirement = scoutCreep.need(availableEnergy, { roomNames: this._roomIds });
  }

}
