import { Strategy } from "abstract.strategy";
import { StarterDrone1CountMilestone, IMilestone, StarterDrone2CountMilestone } from "classes/milestone.class";

export class StarterStrategy extends Strategy {
  protected _milestones: Set<IMilestone> = new Set();

  init(): void {

    // Build 2 harvester drones
    // Build 1 upgrader drone
    // Build 2 more harvester drones
    // Build 1 drone for building stuff
    // Build serveral buildings
    // Repurpose builder drone to start upgrading

    this._milestones.add(new StarterDrone1CountMilestone()); // Ensure there are 2 harvester drones
    this._milestones.add(new StarterDrone2CountMilestone()); //
  }

  run(): void {
    // Build phase
    for (const milestone of this._milestones) {
      if (milestone.condition(this._queen)) continue;

      if (milestone.action) milestone.action(this._queen);
    }

    // Work phase

  }

  cleanup(): void {
    this._completed = Array.from(this._milestones).every(x => x.condition(this._queen));
  }
}
