import { CreepTypes } from "../../../abstractions/creep-types";
import { DroneMemory, genericDroneCreep } from "../../../creeps/generic-drone";
import { Task } from "../../../tasking/task";
import { BuildTask } from "../../../tasking/tasks/build.task";
import { TaskTypes } from "../../../tasking/taskTypes";
import { StratConditionResult, StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class BuildingMilestone extends Milestone {
  private _required = { builders: 3, extensions: 5 };

  init(): void {
    this._stratConfig.conditions.push(new StratConfigCondition("Extensions",
      () => {
        const builders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.build, TaskTypes.stationaryBuild);
        if (builders.length < this._required.builders) return StratConditionResult.Failed;

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

        const drones = this._room.owned.state.creepState.getCreeps(CreepTypes.genericDrone).filter(x => {
          const memory = x.memory as DroneMemory;
          return memory.task?.type !== TaskTypes.build;
        });
        const buildersNeeded = this._required.builders - builders.length;

        const newBuildTask = () => new BuildTask({ pos: constructionSite.pos });

        const tasksNeeded = Math.min(drones.length, buildersNeeded);
        const taskNeeds: Task[] = new Array(tasksNeeded).fill(newBuildTask());

        const creepsNeeded = buildersNeeded - taskNeeds.length;
        const creepNeeds: ICreepRequirement[] = new Array(creepsNeeded).fill(genericDroneCreep.need(budget, {
          task: newBuildTask()
        }));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}