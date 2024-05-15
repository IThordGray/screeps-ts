import { Strat } from "classes/strat";
import { StarterStrat } from "strategies/starter/starter.strat";
import { OnRun, OnUpdate } from "../abstractions/interfaces";

/**
 * Keeps a list of all the strats. During the update call, decides which strat is needed.
 * During this run call, invokes the current strat.
 */
class StratManager implements OnUpdate, OnRun {
  currentStrategy: Strat | undefined;

  run() {
    this.currentStrategy?.run();
  }

  update() {
    if (!this.currentStrategy) {
      this.currentStrategy = new StarterStrat();
      this.currentStrategy.init();
    }

    this.currentStrategy.update();
  }
}

export const strategyManager = new StratManager();
