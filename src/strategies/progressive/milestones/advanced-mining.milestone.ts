import { CreepTypes } from "../../../abstractions/creep-types";
import { haulerCreep, HaulerMemory } from "../../../creeps/hauler";
import { minerCreep } from "../../../creeps/miner";
import { BuilderDrone } from "../../../tasking/tasks/build.task";
import { StationaryBuildTask } from "../../../tasking/tasks/stationary-build.task";
import { StationaryUpgradeTask } from "../../../tasking/tasks/stationary-upgrade.task";
import { UpgraderDrone } from "../../../tasking/tasks/upgrade.task";
import { TaskTypes } from "../../../tasking/taskTypes";
import { StratConditionResult, StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class AdvancedMiningMilestone extends Milestone {


  // private _minerSourceAllocationMap: { [creepName: string]: string } = {};
  // private _sourceMinerAllocationMap: { [sourceId: string]: string } = {};
  // private _haulerSourceAllocationMap: { [creepName: string]: string } = {};
  // private _sourceHaulerAllocationMap: { [sourceId: string]: string } = {};

  // private allocateExistingHaulers() {
  //   this._haulerSourceAllocationMap = {};
  //   this._sourceHaulerAllocationMap = {};
  //
  //   const haulers = this._room.owned.state.creepState.getCreeps(CreepTypes.hauler);
  //   if (!haulers.length) return;
  //
  //   haulers.forEach(creep => {
  //     const memory = creep.memory as HaulerMemory;
  //     if (!memory.sourceId) return;
  //
  //     this._haulerSourceAllocationMap[creep.name] = memory.sourceId;
  //     this._sourceHaulerAllocationMap[memory.sourceId] = creep.name;
  //   });
  // }

  // private allocateExistingMiners() {
  //   this._minerSourceAllocationMap = {};
  //   this._sourceMinerAllocationMap = {};
  //
  //   const miners = this._room.owned.state.creepState.getCreeps(CreepTypes.miner);
  //   if (!miners.length) return;
  //
  //   miners.forEach(creep => {
  //     const memory = creep.memory as MinerMemory;
  //     if (!memory.sourceId) return;
  //
  //     this._minerSourceAllocationMap[creep.name] = memory.sourceId;
  //     this._sourceMinerAllocationMap[memory.sourceId] = creep.name;
  //   });
  // }

  condition() {
    return true;
  }

  init() {
    this._stratConfig.conditions.push(new StratConfigCondition("AdvancedMining",
      () => StratConditionResult.Failed,

      () => {
        const sources = this._room.owned.state.resourceState.getSources();
        const haulers = this._room.owned.state.creepState.getCreeps(CreepTypes.hauler);

        const budget = Math.min(this._room.energyCapacityAvailable, 300);

        const creepNeeds: ICreepRequirement[] = [];

        sources.forEach(source => {
          const minerSpots = source.getMinerSpots();
          creepNeeds.push(...minerSpots.map(spot => minerCreep.need(budget, {
            pos: spot,
            sourceId: source.id,
            room: this._room.name
          })));

          const [ allocatedHauler ] = haulers.filter(x => (x.memory as HaulerMemory).sourceId === source.id);
          if (!allocatedHauler) creepNeeds.push(haulerCreep.need(budget, {
            sourceId: source.id,
            collectPos: source.pos,
            dropOffPos: this._room.owned.state.spawn?.pos
          }));
        });

        const builders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.build) as BuilderDrone[];
        const upgraders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.upgrade) as UpgraderDrone[];

        const taskNeeds = [];
        taskNeeds.push(...builders.map(builder => new StationaryBuildTask({ pos: builder.memory.task.pos })));
        taskNeeds.push(...upgraders.map(upgrader => new StationaryUpgradeTask({ pos: upgrader.memory.task.pos, controllerId: upgrader.memory.task.controllerId })));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}
