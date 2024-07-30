import { CreepTypes } from "../../../abstractions/CreepTypes";
import { GenericDroneNeed } from "../../../creeps/creeps/GenericDrone";
import { findOpenSpotNearTargets } from "../../../helpers/find-open-spot-near-targets.helper";
import { BaseTask } from "../../../tasking/BaseTask";
import { StationaryUpgradeTask } from "../../../tasking/tasks/StationaryUpgradeTask";
import { UpgradeTask } from "../../../tasking/tasks/UpgradeTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { Milestone } from "../Milestone";
import { StratCondition, StratConditionResult } from "../StratCondition";

export class UpgradeRCL2Milestone extends Milestone {

  private _current = { upgraders: 0, controllerLevel: 0 };
  private _required = { upgraders: 4, controllerLevel: 2 };

  init() {
    this._stratConfig.conditions.push(new StratCondition(`Upgrade RCL2`,
      () => {
        this._current.controllerLevel = this._room.owned.state.controller!.level;
        if (this._current.controllerLevel < this._required.controllerLevel) return StratConditionResult.Failed;
        return StratConditionResult.Passed;
      },

      () => {
        const controller = this._room.owned.state.controller!;
        const budget = Math.min(this._room.energyCapacityAvailable, 300);

        const upgraders = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.upgrade, TaskTypes.stationaryUpgrade);
        if (upgraders.length >= this._required.upgraders) return {};

        const drones = this._room.owned.state.creepState.getCreeps(CreepTypes.genericDrone).filter(x => {
          const memory = x.memory as GenericDroneMemory;
          return memory.task?.type !== TaskTypes.upgrade;
        });

        const upgradersNeeded = this._required.upgraders - upgraders.length;

        const newUpgradeTask = () => {
          if (!!Memory.rooms[this._room.name].stratManager?.["stationaryUpgraders"]) {
            const collectPos = findOpenSpotNearTargets([ controller.pos ], 5);
            if (!collectPos) return new UpgradeTask({ pos: controller.pos, controllerId: controller.id });
            return new StationaryUpgradeTask({ controllerId: controller.id, pos: controller.pos, collectPos });
          }
          return new UpgradeTask({ pos: controller.pos, controllerId: controller.id });
        };

        const tasksNeeded = Math.min(drones.length, upgradersNeeded);
        const taskNeeds: BaseTask[] = new Array(tasksNeeded).fill(newUpgradeTask());

        const creepsNeeded = upgradersNeeded - taskNeeds.length;
        const creepNeeds: ICreepRequirement[] = new Array(creepsNeeded).fill(new GenericDroneNeed(budget, {
          task: newUpgradeTask()
        }));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}