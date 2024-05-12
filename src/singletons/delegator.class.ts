import { creepManager } from "./creep-manager";
import { strategyManager } from "./strat-manager";

class Delegator {
  update() {
    strategyManager.update();
  }

  run() {
    strategyManager.run();
    creepManager.run();
  }
}

export const delegator = new Delegator();
