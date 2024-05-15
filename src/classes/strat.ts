import { Milestone } from "classes/milestone";
import { taskDistributor } from "singletons/task-distributor";
import { OnDispose, OnInit, OnRun, OnUpdate } from "../abstractions/interfaces";
import { StratTask } from "./task";

export abstract class Strat implements OnInit, OnUpdate, OnRun, OnDispose {
  protected _milestones: Milestone[] = [];
  protected _currentMilestone: Milestone | undefined;
  protected _strategyTask: StratTask | undefined;

  private getCurrentMilestone(): Milestone | undefined {
    for (const milestone of this._milestones) {
      if (!milestone.condition()) return milestone;
    }
    return undefined;
  }

  dispose() {
  }

  init() {
    this._milestones.forEach(x => x.init());
  }

  run() {
    // Execute priority task.
    if (this._strategyTask) return this._strategyTask.run();

    // Revert to executing milestones.
    return this._currentMilestone?.run();
  }

  update() {
    // Check for priority tasks.
    this._strategyTask = taskDistributor.getStratTask();
    if (this._strategyTask) return;

    // Revert to checking milestones.
    const oldMilestone = this._currentMilestone;
    const newMilestone = this._milestones.find(x => !x.condition());

    if (oldMilestone !== newMilestone) {
      oldMilestone?.dispose();
      newMilestone?.init();
    }

    this._currentMilestone = newMilestone;
    this._currentMilestone?.update();
  }
}
