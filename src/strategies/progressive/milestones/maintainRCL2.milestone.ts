import { genericDroneCreep } from "../../../creeps/generic-drone";
import { UpgradeTask } from "../../../tasking/tasks/upgrade.task";
import { TaskTypes } from "../../../tasking/taskTypes";
import { StratConditionResult, StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class MaintainRCL2Milestone extends Milestone {

  init() {
    this._stratConfig.conditions.pop();

    this._stratConfig.conditions.push(new StratConfigCondition(`Maintain RCL2`,
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

        const creepNeeds: ICreepRequirement[] = [ genericDroneCreep.need(budget, {
          task: newUpgradeTask()
        }) ];

        return { creeps: { creeps: creepNeeds } };
      }
    ));
  }
}