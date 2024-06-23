import { CreepTypes } from "../../../abstractions/creep-types";
import { haulerCreep, HaulerMemory } from "../../../creeps/Hauler";
import { minerCreep } from "../../../creeps/Miner";
import { BuilderDrone } from "../../../tasking/tasks/BuildTask";
import { StationaryBuildTask } from "../../../tasking/tasks/StationaryBuildTask";
import { StationaryUpgradeTask } from "../../../tasking/tasks/StationaryUpgradeTask";
import { UpgraderDrone } from "../../../tasking/tasks/UpgradeTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { StratCondition, StratConditionResult } from "../StratCondition";
import { Milestone } from "../Milestone";

export class AdvancedMiningMilestone extends Milestone {
  init() {
    this._stratConfig.conditions.push(new StratCondition("AdvancedMining",
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
        taskNeeds.push(...upgraders.map(upgrader => new StationaryUpgradeTask({
          pos: upgrader.memory.task.pos,
          controllerId: upgrader.memory.task.controllerId
        })));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}
