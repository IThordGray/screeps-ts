import { creepManager } from "./creep-manager";
import { strategyManager } from "./strat-manager";

class Delegator {
  run() {
    strategyManager.run();
    creepManager.run();
  }

  update() {
    strategyManager.update();
  }
}

export const delegator = new Delegator();
