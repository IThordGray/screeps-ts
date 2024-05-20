import { CreepTypes } from "abstractions/creep-types";
import { Task } from "tasking/task";
import { ICreepRequirements } from "../../../abstractions/interfaces";
import { DroneMemory, genericDroneCreep } from "../../../creeps/drone";
import { RoomState } from "../../../singletons/game-state";
import { HarvestTask } from "../../../tasking/tasks/harvest.task";
import { Milestone } from "./milestone";

// Create 2 drones with 2 Harvest tasks at nearest source
export class DroneMilestone extends Milestone {
  private _currentDroneRequirement?: ICreepRequirements;
  private _currentTaskNeeds: Task[] = [];

  condition(): boolean {
    const drones = RoomState.get(this._roomName).getCreepState(CreepTypes.genericDrone);
    if (drones.length < 1) return false;
    if (drones.some(x => !(x.memory as DroneMemory).task)) return false;
    return true;
  }

  getCreepRequirements(): { creepType: string; budget: number; properties?: Record<string, any> | undefined; }[] {
    return this._currentDroneRequirement ? [ this._currentDroneRequirement ] : [];
  }

  getTaskRequirements(): Task[] {
    return this._currentTaskNeeds;
  }

  update(): void {
    this._currentDroneRequirement = undefined;
    this._currentTaskNeeds = [];

    const budget = RoomState.get(this._roomName).room.energyCapacityAvailable;
    const drones = RoomState.get(this._roomName).getCreepState(CreepTypes.genericDrone);
    const { source } = RoomState.get(this._roomName).getSources()[0];

    if (drones.length < 2) {
      const task = new HarvestTask({ pos: source.pos, sourceId: source.id });
      this._currentDroneRequirement = genericDroneCreep.need(budget, { task });
      this._currentTaskNeeds = [ task ];
    }

    const unallocatedCreeps = this._taskAllocator.getUnallocatedDrones();
    this._currentTaskNeeds.push(...unallocatedCreeps.map(creep => new HarvestTask({
      pos: source.pos,
      sourceId: source.id
    })));
  }
}
