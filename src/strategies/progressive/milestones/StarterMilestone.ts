import { genericDroneCreep } from "../../../creeps/GenericDrone";
import { HarvestTask } from "../../../tasking/tasks/HarvestTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { StratConditionResult, StratCondition } from "../StratCondition";
import { Milestone } from "../Milestone";

// Create 2 drones with 2 Harvest tasks at nearest source
export class StarterMilestone extends Milestone {

  private _required = { harvesters: 1 };
  private _current = { harvesters: 0 };

  init() {
    this._stratConfig.conditions.push(new StratCondition(`Harvester`,
      () => {
        this._current.harvesters = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.harvest).length;
        if (this._current.harvesters < this._required.harvesters) return StratConditionResult.Failed;
        return StratConditionResult.Passed;
      },

      () => {
        const budget = Math.min(this._room.energyCapacityAvailable, 300);
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
