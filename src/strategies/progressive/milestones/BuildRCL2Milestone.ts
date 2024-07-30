import { CreepTypes } from "../../../abstractions/CreepTypes";
import { GenericDroneCreep, GenericDroneNeed } from "../../../creeps/creeps/GenericDrone";
import { findOpenSpotNearTargets } from "../../../helpers/find-open-spot-near-targets.helper";
import { BaseTask } from "../../../tasking/BaseTask";
import { BuildTask } from "../../../tasking/tasks/BuildTask";
import { StationaryBuildTask } from "../../../tasking/tasks/StationaryBuildTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { Milestone } from "../Milestone";
import { StratCondition, StratConditionResult } from "../StratCondition";

export class BuildRCL2Milestone extends Milestone {
  private _required = { builders: 3, extensions: 5 };

  init(): void {
    this._stratConfig.conditions.push(new StratCondition("Extensions",
      () => {
        const extensions = this._room.owned.state.structureState.getExtensions().length;
        if (extensions < this._required.extensions) return StratConditionResult.Parallel;
        return StratConditionResult.Passed;
      },

      () => {
        const [ constructionSite ] = this._room.owned.state.constructionState.getConstructionSites();
        if (!constructionSite) return {};
        const budget = Math.min(this._room.energyCapacityAvailable, 300);

        const builders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.build, TaskTypes.stationaryBuild);
        if (builders.length >= this._required.builders) return {};

        const drones = this._room.owned.state.creepState.getCreeps(CreepTypes.genericDrone).filter(creep => {
          const drone = creep as GenericDroneCreep;
          return drone.memory.task?.type !== TaskTypes.build;
        });
        const buildersNeeded = this._required.builders - builders.length;

        const newBuildTask = () => {
          if (!!Memory.rooms[this._room.name].stratManager?.["stationaryBuilders"]) {
            const collectPos = findOpenSpotNearTargets([ constructionSite.pos ], 5);
            if (!collectPos) return new BuildTask({ pos: constructionSite.pos });
            return new StationaryBuildTask({ pos: constructionSite.pos, collectPos });
          }
          return new BuildTask({ pos: constructionSite.pos });
        };

        const tasksNeeded = Math.min(drones.length, buildersNeeded);
        const taskNeeds: BaseTask[] = new Array(tasksNeeded).fill(newBuildTask());

        const creepsNeeded = buildersNeeded - taskNeeds.length;
        const creepNeeds: ICreepRequirement[] = new Array(creepsNeeded).fill(new GenericDroneNeed(budget, {
          task: newBuildTask()
        }));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}