// Tasks are decided based on the current strat.
// Each cycle a tasks is ignored, the prio goes up.

import { uniqueId } from "lodash";

// A creep is more likely to pick up a task with higher prio.
export abstract class Task {
  id = uniqueId();
  priority = 0;

  abstract run(...args: any[]): void;
}

export abstract class CreepTask extends Task {
  creepLimit = 1;

  abstract run(creep: Creep): void;
}

export abstract class StratTask extends Task {

}
