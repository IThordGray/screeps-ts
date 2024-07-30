import { GenericDroneNeed } from "../../../creeps/creeps/GenericDrone";
import { UpgradeTask } from "../../../tasking/tasks/UpgradeTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { StratConditionResult, StratCondition } from "../StratCondition";
import { Milestone } from "../Milestone";

export class MaintainRCL2Milestone extends Milestone {

  init() {
    this._stratConfig.conditions.pop();

    this._stratConfig.conditions.push(new StratCondition(`Maintain RCL2`,
      () => StratConditionResult.Recurring,

      () => {
        const controller = this._room.owned.state.controller;
        if (!controller) return {};
        //
        // if (controller.ticksToDowngrade >= 5000) return {};

        const budget = Math.min(this._room.energyCapacityAvailable, 300);

        const upgraders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.upgrade, TaskTypes.stationaryUpgrade);
        if (!!upgraders.length) return {};

        const newUpgradeTask = () => new UpgradeTask({
          pos: controller.pos,
          controllerId: controller.id
        });

        const creepNeeds: ICreepRequirement[] = [ new GenericDroneNeed(budget, {
          task: newUpgradeTask()
        }) ];

        return { creeps: { creeps: creepNeeds } };
      }
    ));
  }
}