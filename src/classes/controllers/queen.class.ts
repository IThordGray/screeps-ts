import { StarterStrategy } from "strategies/starter.strat";
import { Delegator } from "./delegator.class";
import { Hatchery } from "./hatchery.class";

export type CreepType = "drone";
export class Queen {
  readonly hatchery = new Hatchery(this);

  currentStrat = new StarterStrategy(this);

  constructor(readonly spawn: StructureSpawn) {}

  // Need to attach to the game loop and carry out the init, run and cleanup logic of the currentStrat;
  // Given the current strat, the delegator needs to assign tasks to the creeps
}
