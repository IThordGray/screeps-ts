import { Milestone } from "classes/milestone";
import { taskDistributor } from "singletons/task-distributor";
import { StratTask } from "./task";

export abstract class Strat {
  protected _milestones: Milestone[] = [];
  protected _currentMilestone: Milestone | undefined;
  protected _strategyTask: StratTask | undefined;

  protected cleanup(): void {
  }

  protected done(): void {
    this.cleanup();
  }

  private getCurrentMilestone(): Milestone | undefined {
    for (const milestone of this._milestones) {
      if (!milestone.condition()) return milestone;
    }
    return undefined;
  }

  update() {
    this._strategyTask = taskDistributor.getStratTask();

    const newMilestone = this.getCurrentMilestone();
    if (this._currentMilestone !== newMilestone) {
      this._currentMilestone?.dispose();
      newMilestone?.init();
    }

    this._currentMilestone = newMilestone;
    if (!this._currentMilestone) this.done();
  }

  run() {
    if (this._strategyTask) return this._strategyTask.run();
    return this._currentMilestone?.run();
  }
}
