import { genericDroneCreep } from "../../../creeps/generic-drone";

import { RoomState } from "../../../states/roomState";
import { UpgradeTask } from "../../../tasking/tasks/upgrade.task";
import { TaskType } from "../../../tasking/taskType";
import { StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class UpgradeToLvl2Milestone extends Milestone {

  private _current = { upgraders: 0, controllerLevel: 0 };
  private _required = { upgraders: 4, controllerLevel: 2 };

  init() {
    this._stratConfig.conditions.push(new StratConfigCondition(
      () => {
        this._current.upgraders = this._taskAllocator.getAllocatedDrones(TaskType.upgrade).length;
        if (this._current.upgraders < this._required.upgraders) return false;

        this._current.controllerLevel = this._room.owned.state.controller!.level;
        if (this._current.controllerLevel < this._required.controllerLevel) return false;

        return true;
      },

      () => {
        const roomState = this._room.owned.state;
        const budget = this._room.energyCapacityAvailable;
        const controller = roomState.controller!;

        const newUpgrader = () => genericDroneCreep.need(budget, {
          task: new UpgradeTask({
            pos: controller.pos,
            controllerId: controller.id
          })
        });

        const creeps = new Array<ICreepRequirement>(this._required.upgraders - this._current.upgraders).fill(newUpgrader());
        return { creeps: { creeps } };
      }
    ));
  }
}