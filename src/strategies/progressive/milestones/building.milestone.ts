import { genericDroneCreep } from "../../../creeps/generic-drone";
import { BuildTask } from "../../../tasking/tasks/build.task";
import { TaskType } from "../../../tasking/taskType";
import { StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class BuildingMilestone extends Milestone {
  private _current = { builders: 0, extensions: 0 };
  private _required = { builders: 4, extensions: 5 };

  condition(): boolean {
    const roomState = this._room.owned.state;
    const containers = roomState.structureState.getContainers();
    return containers.length > 5;
  }

  init(): void {
    this._stratConfig.conditions.pop();
    this._stratConfig.conditions.push(new StratConfigCondition(
      () => {
        this._current.builders = this._taskAllocator.getAllocatedDrones(TaskType.build).length;
        if (this._current.builders < this._required.builders) return false;

        this._current.extensions = this._room.owned.state.structureState.getExtensions().length;
        if (this._current.extensions < this._required.extensions) return false;

        return true;
      },
      () => {
        const [ constructionSite ] = this._room.owned.state.constructionState.getConstructionSites();
        if (!constructionSite) return {};

        const newBuildTask = () => new BuildTask({ pos: constructionSite.pos });
        const tasks = new Array(this._required.builders - this._current.builders).fill(newBuildTask());
        return { tasks: { tasks } };
      }
    ));
  }

  update(): void {
    const budget = this._room.energyCapacityAvailable;
    const builders = this._taskAllocator.getAllocatedDrones(TaskType.build);
    if (builders.length < 7) this._creepRequirement = genericDroneCreep.need(budget, {});

    const [ constructionSite ] = this._room.owned.state.constructionState.getConstructionSites();
    const neededTasks = 7 - builders.length;
    if (!constructionSite) return;
    const buildTask = () => new BuildTask({ pos: constructionSite.pos });
    this._taskRequirements = new Array(neededTasks).fill(buildTask());
  }
}