import { ActionStatus, IMilestone } from "classes/milestone.class";
import { Queen } from "classes/controllers/queen.class";
import { Delegator } from "classes/controllers/delegator.class";

export abstract class Strategy {
  protected _completed: boolean = false;
  protected _milestones: Set<IMilestone> = new Set();

  delegator: Delegator = new Delegator(this._queen);

  constructor(protected _queen: Queen) {}

  abstract init(): void;
  abstract run(): void;
  abstract cleanup(): void;
}
