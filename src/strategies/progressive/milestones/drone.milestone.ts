import { genericDroneCreep } from "../../../creeps/generic-drone";

import { RoomState } from "../../../states/roomState";
import { HarvestTask } from "../../../tasking/tasks/harvest.task";
import { TaskType } from "../../../tasking/taskType";
import { StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

// Create 2 drones with 2 Harvest tasks at nearest source
export class DroneMilestone extends Milestone {

  private _required = { harvesters: 1 };
  private _current = { harvesters: 0 };

  init() {
    this._stratConfig.conditions.push(new StratConfigCondition(
      () => {
        this._current.harvesters = this._taskAllocator.getAllocatedDrones(TaskType.harvest).length;
        if (this._current.harvesters < this._required.harvesters) return false;
        return true;
      },

      () => {
        const budget = this._room.energyCapacityAvailable;
        const source = this._room.owned.state.resourceState.getSources()[0];
        const newDrone = () => genericDroneCreep.need(budget, {
          task: new HarvestTask({
            pos: source.pos,
            sourceId: source.id
          })
        });
        const creeps = new Array<ICreepRequirement>(this._required.harvesters - this._current.harvesters).fill(newDrone());
        return { creeps: { creeps } };
      }
    ));
  }

}
