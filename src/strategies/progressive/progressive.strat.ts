import { EventTypes } from "../../abstractions/eventTypes";
import { IStratNeeds } from "../../abstractions/interfaces";
import { eventBus } from "../../singletons/eventBus";
import { Task } from "../../tasking/task";
import { AdvancedMiningMilestone } from "./milestones/advanced-mining.milestone";
import { BuildingMilestone } from "./milestones/building.milestone";
import { DroneMilestone } from "./milestones/drone.milestone";
import { MaintainRCL2Milestone } from "./milestones/maintainRCL2.milestone";
import { Milestone } from "./milestones/milestone";
import { MiningMilestone } from "./milestones/mining.milestone";
import { UpgradeRCL2Milestone } from "./milestones/upgradeRCL2.milestone";
import { StratConditionResult, StratConfigCondition } from "./stratConfigCondition";

export class StratConfig {
  conditions: StratConfigCondition[] = [];
}

export class ProgressiveStrat implements IStrat {
  private readonly _config = new StratConfig();

  private _taskRequirements: Task[] = [];
  private _creepRequirement: ICreepRequirement[] = [];
  // private _structureNeeds?: IStructureNeeds;
  // private _controllerNeeds?: IControllerNeeds | undefined;

  private readonly _loadedMilestones: Milestone[] = [];
  private readonly _milestones: (() => Milestone)[] = [];

  get taskNeeds() {
    return this._taskRequirements;
  }

  get creepNeeds() {
    return this._creepRequirement;
  }

  // get structureNeeds() {
  //   return this._structureNeeds;
  // }

  // get controllerNeeds() {
  //   return this._controllerNeeds;
  // }

  constructor(
    private readonly _room: Room
  ) {

    this._milestones = this.getMilestoneFactories();

    // Instantiate all milestones, until you get to the one that's in memory (Global reset)
    const milestoneInMemory = Memory.rooms?.[this._room.name]?.stratManager?.currentMilestone;
    if (!milestoneInMemory) return;

    let milestone: string | undefined = undefined;
    while (milestone !== milestoneInMemory && !!this._milestones.length) {
      milestone = this.loadNextMilestone(true);
    }
  }

  private getMilestoneFactories() {
    return [
      () => new DroneMilestone(this._room, this._config),
      () => new MiningMilestone(this._room, this._config),
      () => new UpgradeRCL2Milestone(this._room, this._config),
      () => new MaintainRCL2Milestone(this._room, this._config),
      () => new BuildingMilestone(this._room, this._config),
      () => new AdvancedMiningMilestone(this._room, this._config)
    ];
  }

  private loadNextMilestone(isReload = false): string | undefined {
    const nextMilestone = this._milestones.shift();
    if (!nextMilestone) return undefined;

    const milestone = nextMilestone();
    this._loadedMilestones.push(milestone);
    if (!isReload) {
      // set the current milestone to memory (in case of global reset)
      Memory.rooms[this._room.name] ??= {};
      Memory.rooms[this._room.name].stratManager ??= {};
      Memory.rooms[this._room.name].stratManager!.currentMilestone = milestone.constructor.name;

      eventBus.emit(EventTypes.milestoneActivated, { name: milestone.constructor.name });
    }

    return milestone.constructor.name;
  }

  getStatus(): Record<string, any> {
    const currentMilestone = this._loadedMilestones[this._loadedMilestones.length - 1];
    const status: Record<string, any> = {
      "Current milestone": currentMilestone?.constructor.name.substring(0, currentMilestone?.constructor.name.indexOf('Milestone'))
    };

    this._config.conditions.forEach(x => {
      if (x.check() === StratConditionResult.Passed) status[x.name] = "✅";
      if (x.check() === StratConditionResult.Failed) status[x.name] = "❌";
      if (x.check() === StratConditionResult.Recurring) status[x.name] = "🔁";
      if (x.check() === StratConditionResult.Parallel) status[x.name] = "🔀";
    });

    return status;
  }

  update() {
    // Find a condition in the current config that is not satisfied.

    let condition = this._config.conditions.find(x => x.check() === StratConditionResult.Failed);

    while (!condition && !!this._milestones.length) {
      // There are milestones to load and o condition found yet.
      this.loadNextMilestone();
      condition = this._config.conditions.find(x => x.check() === StratConditionResult.Failed);
    }

    // No condition has been found, and no milestones are left.
    // Todo: notify engine
    // if (!condition) return;

    const conditions = this._config.conditions.filter(x => [ StratConditionResult.Recurring, StratConditionResult.Parallel, StratConditionResult.Failed ].includes(x.check()));

    let needs: IStratNeeds = {};
    conditions.forEach(condition => {
      const { creeps, tasks } = condition.action();
      if (!!creeps?.creeps?.length) {
        needs.creeps ??= { creeps: [] };
        needs.creeps.creeps.push(...creeps.creeps);
      }

      if (!!tasks?.tasks?.length) {
        needs.tasks ??= { tasks: [] };
        needs.tasks.tasks.push(...tasks.tasks);
      }
    });

    // Based on the needs, set the task, creep and structure requirements
    const taskNeeds = needs.tasks;
    if (taskNeeds) this._taskRequirements = taskNeeds.tasks;

    const creepNeeds = needs.creeps;
    if (creepNeeds) this._creepRequirement = creepNeeds.creeps;

    // const structureNeeds = needs.structures;
    // if (structureNeeds) this._structureNeeds = structureNeeds.structures;

    // const controllerNeeds = needs.controller;
    // if (controllerNeeds) this._structureNeeds = controllerNeeds;

  }
}