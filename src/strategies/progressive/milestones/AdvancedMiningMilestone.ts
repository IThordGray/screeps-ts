import { CreepTypes } from "../../../abstractions/CreepTypes";
import { EventTypes } from "../../../abstractions/EventTypes";
import { HaulerNeed } from "../../../creeps/creeps/Hauler";
import { MinerNeed } from "../../../creeps/creeps/Miner";
import { eventBus } from "../../../singletons/EventBus";
import { Milestone } from "../Milestone";
import { StratCondition, StratConditionResult } from "../StratCondition";

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
          creepNeeds.push(...minerSpots.map(spot => new MinerNeed(budget, {
            pos: spot,
            sourceId: source.id,
            room: this._room.name
          })));

          const [ allocatedHauler ] = haulers.filter(x => (x.memory as HaulerMemory).sourceId === source.id);
          if (!allocatedHauler) creepNeeds.push(new HaulerNeed(budget, {
            sourceId: source.id,
            collectPos: source.pos,
            dropOffPos: this._room.owned.state.spawn?.pos
          }));
        });

        Memory.rooms[this._room.name].stratManager ??= {};
        Memory.rooms[this._room.name].stratManager!['stationaryUpgraders'] = true;
        Memory.rooms[this._room.name].stratManager!['stationaryBuilders'] = true;


        // const builders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.build) as BuilderDrone[];
        // const upgraders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.upgrade) as UpgraderDrone[];

        // const taskNeeds = [];
        // taskNeeds.push(...builders.map(builder => new StationaryBuildTask({ pos: builder.memory.task.pos })));
        //
        // taskNeeds.push(...upgraders.map(upgrader => new StationaryUpgradeTask({
        //   pos: upgrader.memory.task.pos,
        //   controllerId: upgrader.memory.task.controllerId
        // })));

        return { creeps: { creeps: creepNeeds } };
      }
    ));
  }
}
