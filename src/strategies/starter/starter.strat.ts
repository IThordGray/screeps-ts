import { Strat } from "classes/strat";
import { DroneMilestone } from "./drone.milestone";
import { HarvestHaulerMilestone } from "./mining.milestone";
import { InitialScoutingMilestone } from "./scouting.milestone";
import { LongDistanceHarvestingMilestone } from "./long-distance-harvesting.milestone";
import { Logger } from "helpers/logger";

export class StarterStrat extends Strat {
  constructor() {
    super();
    // Build a drop harvester / hauler pair
    this._milestones.push(new DroneMilestone());

    this._milestones.push(new HarvestHaulerMilestone());

    this._milestones.push(new InitialScoutingMilestone());

    // Build a long distance harvester x3 per adjacent rooms
    this._milestones.push(new LongDistanceHarvestingMilestone())
  }

  run(): void {
    Logger.info(this._currentMilestone?.constructor.name ?? 'No milestone found');
    this._currentMilestone?.run();
  }
}
