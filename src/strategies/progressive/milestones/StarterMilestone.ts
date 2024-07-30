import { GenericDroneNeed } from "../../../creeps/creeps/GenericDrone";
import { HarvestTask } from "../../../tasking/tasks/HarvestTask";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { Milestone } from "../Milestone";
import { StratCondition, StratConditionResult } from "../StratCondition";

// Create 2 drones with 2 Harvest tasks at nearest source
export class StarterMilestone extends Milestone {

  private _required = { harvesters: 1 };

  init() {
    this._stratConfig.conditions.push(new StratCondition(`Harvester`,
      () => {
        const harvesters = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.harvest).length;
        if (harvesters < this._required.harvesters) return StratConditionResult.Failed;
        return StratConditionResult.Passed;
      },

      () => {
        const harvesters = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.harvest).length;
        const budget = Math.min(this._room.energyCapacityAvailable, 300);
        const source = this._room.owned.state.resourceState.getSources()[0];
        const newDrone = () => new GenericDroneNeed(budget, {
          task: new HarvestTask({
            pos: source.pos,
            sourceId: source.id
          })
        });
        const creeps = new Array<ICreepRequirement>(this._required.harvesters - harvesters).fill(newDrone());
        return { creeps: { creeps } };
      }
    ));
  }

}
