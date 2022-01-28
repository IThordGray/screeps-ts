import { Queen } from "./controllers/queen.class";

export type ActionStatus = "SUCCESS" | "IN_PROGRESS" | "FAILURE";

export interface IMilestone {
  condition: (...args: any[]) => boolean;
  // Dispatch an action
  action: (...args: any[]) => ActionStatus;
}

export class StarterDrone1CountMilestone implements IMilestone {
  condition = (queen: Queen) => {

    const drones = queen.hatchery.

    Object.entries(queen.currentStrat.delegator.creepTasks).
    return queen.currentStrat.delegator.getCreepCount("drone") > 2;
  };
  action = (queen: Queen) => queen.hatchery.spawn("drone");
}

export class StarterDrone2CountMilestone implements IMilestone {
  condition = (queen: Queen) => queen.hatchery.getCreepCount("drone") > 4;
  action = (queen: Queen) => queen.hatchery.spawn("drone");
}
