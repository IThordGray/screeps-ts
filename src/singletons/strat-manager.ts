import { Strat } from "classes/strat";
import { StarterStrat } from "strategies/starter/starter.strat";

class StratManager {
    currentStrategy: Strat | undefined;

    update() {
        this.currentStrategy ??= new StarterStrat();
        this.currentStrategy.update();
    }

    run() {
        this.currentStrategy?.run();
    }
}

export const strategyManager = new StratManager();
