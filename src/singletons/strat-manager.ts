import { Strat } from "classes/strat";
import { StarterStrat } from "strategies/starter/starter.strat";

class StratManager {
  currentStrategy: Strat | undefined;

  run() {
    this.currentStrategy?.run();
  }

  update() {
    this.currentStrategy ??= new StarterStrat();
    this.currentStrategy.update();
  }
}

export const strategyManager = new StratManager();
