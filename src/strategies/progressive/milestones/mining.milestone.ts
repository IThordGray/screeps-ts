import { CreepTypes } from "abstractions/creep-types";
import { ICreepRequirements } from "abstractions/interfaces";
import { haulerCreep, HaulerMemory } from "creeps/hauler";
import { minerCreep, MinerMemory } from "creeps/miner";
import { Task } from "tasking/task";
import { genericDroneCreep } from "../../../creeps/drone";
import { RoomState } from "../../../singletons/game-state";
import { TaskPriority } from "../../../tasking/taskPriority";
import { HarvestTask } from "../../../tasking/tasks/harvest.task";
import { ScoutingTask } from "../../../tasking/tasks/scouting.task";
import { Milestone } from "./milestone";

// Create another 2 drones per extra source.
// Create a miner / hauler pair for each source in the room.
// Take one drone from each source and reallocate them to Scouting tasks
export class MiningMilestone extends Milestone {
  private _minerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceMinerAllocationMap: { [sourceId: string]: string } = {};
  private _haulerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceHaulerAllocationMap: { [sourceId: string]: string } = {};
  private _creepRequirement: ICreepRequirements | undefined;
  private _taskRequirements: Task[] = [];

  private allocateExistingHaulers() {
    this._haulerSourceAllocationMap = {};
    this._sourceHaulerAllocationMap = {};

    const haulers = RoomState.get(this._roomName).getCreepState(CreepTypes.hauler);
    if (!haulers.length) return;

    haulers.forEach(creep => {
      const memory = creep.memory as HaulerMemory;
      if (!memory.sourceId) return;

      this._haulerSourceAllocationMap[creep.name] = memory.sourceId;
      this._sourceHaulerAllocationMap[memory.sourceId] = creep.name;
    });
  }

  private allocateExistingMiners() {
    this._minerSourceAllocationMap = {};
    this._sourceMinerAllocationMap = {};

    const miners = RoomState.get(this._roomName).getCreepState(CreepTypes.miner);
    if (!miners.length) return;

    miners.forEach(creep => {
      const memory = creep.memory as MinerMemory;
      if (!memory.sourceId) return;

      this._minerSourceAllocationMap[creep.name] = memory.sourceId;
      this._sourceMinerAllocationMap[memory.sourceId] = creep.name;
    });
  }

  condition() {
    const drones = RoomState.get(this._roomName).getCreepCount(CreepTypes.genericDrone);
    if (drones < (2 * RoomState.get(this._roomName).getSources().length) + 2) return false;

    const miners = RoomState.get(this._roomName).getCreepCount(CreepTypes.miner);
    if (miners < RoomState.get(this._roomName).getSources().length) return false;

    const haulers = RoomState.get(this._roomName).getCreepCount(CreepTypes.hauler);
    if (miners !== haulers) return false;

    return true;
  }

  getCreepRequirements(): ICreepRequirements[] {
    return this._creepRequirement ? [ this._creepRequirement ] : [];
  }

  getTaskRequirements(): Task[] {
    return this._taskRequirements;
  }

  update() {
    this.allocateExistingMiners();
    this.allocateExistingHaulers();
    this.updateRequirements();
  }

  updateRequirements() {
    let budget = RoomState.get(this._roomName).room.energyCapacityAvailable;

    const sources = RoomState.get(this._roomName).getSources();
    // console.log(JSON.stringify(sources.map(s => ({ id: s.source.id, pos: s.source.pos }))));
    for (let i = 0; i < sources.length; i++) {
      const { source } = sources[i];

      const drones = RoomState.get(this._roomName).getCreepState(CreepTypes.genericDrone);
      if (drones.length < (1 * i)) {
        const harvestTask = new HarvestTask({ sourceId: source.id, pos: source.pos });
        this._taskRequirements.push(harvestTask);
        this._creepRequirement = genericDroneCreep.need(budget, { task: harvestTask });
        return;
      }

      const allocatedMiner = this._sourceMinerAllocationMap[source.id];
      if (!allocatedMiner) {
        this._creepRequirement = minerCreep.need(budget, { pos: source.pos, sourceId: source.id });
        return;
      }

      const allocatedHauler = this._sourceHaulerAllocationMap[source.id];
      if (!allocatedHauler) {
        this._creepRequirement = haulerCreep.need(budget, {
          sourceId: source.id,
          collectPos: source.pos,
          dropOffPos: RoomState.get(this._roomName).spawn.pos
        });
        return;
      }
    }

    const exits = RoomState.get(this._roomName).room.find(FIND_EXIT);
    for (let i = 0; i > Math.min(exits.length, sources.length); i++) {
      this._taskRequirements.push(new ScoutingTask({ pos: exits[i], priority: TaskPriority.high, roomNames: [] }));
    }

    this._creepRequirement = genericDroneCreep.need(budget, {});
    return;
  }
}
