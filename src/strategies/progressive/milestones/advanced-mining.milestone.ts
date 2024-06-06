import { CreepTypes } from "../abstractions/creep-types";
import { haulerCreep, HaulerMemory } from "creeps/hauler";
import { minerCreep, MinerMemory } from "creeps/miner";
import { genericDroneCreep } from "../../../creeps/generic-drone";
import { getAdjacentRoomNames } from "../../../helpers/get-adjacent-room-names";

import { RoomState } from "../../../states/roomState";
import { TaskPriority } from "../../../tasking/taskPriority";
import { HarvestTask } from "../../../tasking/tasks/harvest.task";
import { ScoutingTask } from "../../../tasking/tasks/scouting.task";
import { TaskType } from "../../../tasking/taskType";
import { StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

// Create another 2 drones per extra source.
// Create a miner / hauler pair for each source in the room.
// Take one drone from each source and reallocate them to Scouting tasks
export class AdvancedMiningMilestone extends Milestone {
  private _minerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceMinerAllocationMap: { [sourceId: string]: string } = {};
  private _haulerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceHaulerAllocationMap: { [sourceId: string]: string } = {};

  private allocateExistingHaulers() {
    this._haulerSourceAllocationMap = {};
    this._sourceHaulerAllocationMap = {};

    const haulers = this._room.owned.state.creepState.getCreeps(CreepTypes.hauler);
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

    const miners = this._room.owned.state.creepState.getCreeps(CreepTypes.miner);
    if (!miners.length) return;

    miners.forEach(creep => {
      const memory = creep.memory as MinerMemory;
      if (!memory.sourceId) return;

      this._minerSourceAllocationMap[creep.name] = memory.sourceId;
      this._sourceMinerAllocationMap[memory.sourceId] = creep.name;
    });
  }

  init() {
    this._stratConfig.conditions = [];
    this._stratConfig.conditions.push(new StratConfigCondition(
      () => {
        const miners = this._room.owned.state.creepState.getCreepCount(CreepTypes.miner);
        if (miners < 1) return false;

        const haulers = this._room.owned.state.creepState.getCreepCount(CreepTypes.hauler);
        if (haulers < 1) return false;

        const scouts = this._taskAllocator.getAllocatedDrones(TaskType.scout);
        if (scouts.length < 1) return false;
        return true;
      },

      () => ({

      })
    ));
  }

  condition() {
    const sources = this._room.owned.state.getSources({ excludeHostiles: true });
    const exits = Object.values(getAdjacentRoomNames(this._roomName)).length;
    const scoutRequirement = Math.min(sources.length, exits);

    const drones = this._room.owned.state.creepState.getCreepCount(CreepTypes.genericDrone);
    if (drones < (1 * sources.length  /*+ scoutRequirement*/)) {
      // console.log('Drones condition failing');
      return false;
    }

    const miners = this._room.owned.state.creepState.getCreepCount(CreepTypes.miner);
    if (miners < sources.length) {
      // console.log('Miners condition failing');
      return false;
    }

    const haulers = this._room.owned.state.creepState.getCreepCount(CreepTypes.hauler);
    if (haulers < miners ) {
      // console.log('Haulers condition failing');
      return false;
    }

    return true;
  }

  update() {
    this.allocateExistingMiners();
    this.allocateExistingHaulers();
    this.updateRequirements();
  }

  updateRequirements() {
    let budget = this._room.owned.state.room.energyCapacityAvailable;

    const sources = this._room.owned.state.getSources({ excludeHostiles: true });
    for (let i = 0; i < sources.length; i++) {
      const { source } = sources[i];

      const drones = this._taskAllocator.getAllocatedDrones(TaskType.harvest);
      if (drones.length < (1 * (i + 1))) {
        const harvestTask = new HarvestTask({ sourceId: source.id, pos: source.pos });
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
          dropOffPos: this._room.owned.state.spawn.pos
        });
        return;
      }
    }

    const exits = Object.values(getAdjacentRoomNames(this._roomName));
    const scouts = this._taskAllocator.getAllocatedDrones(TaskType.scout);
    const requiredScoutCount = Math.min(exits.length, sources.length);
    if (scouts.length !== requiredScoutCount) {
      for (let i = 0; i > requiredScoutCount; i++) {
        // Reallocate drones to scout nearby rooms.
        this._taskRequirements.push(new ScoutingTask({
          pos: new RoomPosition(25, 25, exits[i]),
          priority: TaskPriority.high,
          roomNames: []
        }));

        this._creepRequirement = genericDroneCreep.need(budget, {});
      }
    }
  }
}
