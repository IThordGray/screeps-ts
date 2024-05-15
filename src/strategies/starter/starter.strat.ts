import { Strat } from "classes/strat";
import { Logger } from "helpers/logger";
import { DroneMilestone } from "./drone.milestone";
import { LdhMilestone } from "./ldh.milestone";
import { MiningMilestone } from "./mining.milestone";
import { ScoutingMilestone } from "./scouting.milestone";

export class StarterStrat extends Strat {
  constructor() {
    super();
    // Build a drop harvester / hauler pair
    this._milestones.push(new DroneMilestone());

    this._milestones.push(new MiningMilestone());

    this._milestones.push(new ScoutingMilestone());

    // Build a long distance harvester x3 per adjacent rooms
    this._milestones.push(new LdhMilestone());
  }

  run(): void {
    super.run();
    Logger.info(this._currentMilestone?.constructor.name ?? "No milestone found");
  }
}
