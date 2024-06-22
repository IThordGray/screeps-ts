import { CreepTypes } from "../../../abstractions/creep-types";
import { DroneMemory, genericDroneCreep } from "../../../creeps/generic-drone";
import { Task } from "../../../tasking/task";
import { UpgradeTask } from "../../../tasking/tasks/upgrade.task";
import { TaskTypes } from "../../../tasking/taskTypes";
import { StratConditionResult, StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class UpgradeRCL2Milestone extends Milestone {

  private _current = { upgraders: 0, controllerLevel: 0 };
  private _required = { upgraders: 4, controllerLevel: 2 };

  init() {
    this._stratConfig.conditions.push(new StratConfigCondition(`Upgrade RCL2`,
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
          const memory = x.memory as DroneMemory;
          return memory.task?.type !== TaskTypes.upgrade;
        });

        const upgradersNeeded = this._required.upgraders - upgraders.length;

        const newUpgradeTask = () => new UpgradeTask({
          pos: controller.pos,
          controllerId: controller.id
        });

        const tasksNeeded = Math.min(drones.length, upgradersNeeded);
        const taskNeeds: Task[] = new Array(tasksNeeded).fill(newUpgradeTask());

        const creepsNeeded = upgradersNeeded - taskNeeds.length;
        const creepNeeds: ICreepRequirement[] = new Array(creepsNeeded).fill(genericDroneCreep.need(budget, {
          task: newUpgradeTask()
        }));

        return { creeps: { creeps: creepNeeds }, tasks: { tasks: taskNeeds } };
      }
    ));
  }
}