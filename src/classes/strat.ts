import { Task } from "tasking/task";
import { IStrat } from "../abstractions/interfaces";
import { Milestone } from "../strategies/progressive/milestones/milestone";

// import { StratTask } from "../tasking/task";

export abstract class Strat implements IStrat {
  protected _milestones: Milestone[] = [];
  protected _currentMilestone: Milestone | undefined;

  private getCurrentMilestone(): Milestone | undefined {
    for (const milestone of this._milestones) {
      if (!milestone.condition()) return milestone;
    }
    return undefined;
  }

  dispose() {
  }

  abstract getCreepRequirements(): {
    creepType: string;
    budget: number;
    properties?: Record<string, any> | undefined;
  }[];

  // protected _strategyTask: StratTask | undefined;

  abstract getTaskRequirements(): Task[];

  abstract isDone(): boolean;

  update() {
    // Check for priority tasks.
    // this._strategyTask = taskDistributor.getStratTask();
    // if (this._strategyTask) return;

    // Revert to checking milestones.
    const oldMilestone = this._currentMilestone;
    const newMilestone = this._milestones.find(x => !x.condition());

    // if (oldMilestone !== newMilestone) {
    //   oldMilestone?.dispose();
    //   newMilestone?.init();
    // }

    this._currentMilestone = newMilestone;
    this._currentMilestone?.update();
  }
}
