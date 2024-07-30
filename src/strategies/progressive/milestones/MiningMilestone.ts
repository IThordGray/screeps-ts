import { CreepTypes } from "../../../abstractions/CreepTypes";
import { ICreepNeeds, ITaskNeeds } from "../../../abstractions/interfaces";
import { GenericDroneNeed } from "../../../creeps/creeps/GenericDrone";
import { HaulerNeed } from "../../../creeps/creeps/Hauler";
import { MinerNeed } from "../../../creeps/creeps/Miner";
import { getAdjacentRoomNames } from "../../../helpers/get-adjacent-room-names";
import { TaskPriority } from "../../../tasking/TaskPriority";
import { ScoutingTask } from "../../../tasking/tasks/Scouting.task";
import { TaskTypes } from "../../../tasking/TaskTypes";
import { Milestone } from "../Milestone";
import { StratCondition, StratConditionResult } from "../StratCondition";

export class MiningMilestone extends Milestone {

  private _required = { miners: 1, haulers: 1 };
  private _current = { miners: 0, haulers: 0 };

  init() {
    this._stratConfig.conditions = [
      new StratCondition("Miners",
        () => {
          this._current.miners = this._room.owned.state.creepState.getCreepCount(CreepTypes.miner);
          if (this._current.miners < this._required.miners) return StratConditionResult.Failed;
          return StratConditionResult.Passed;
        },

        () => {
          const creepNeeds: ICreepNeeds = { creeps: [] };

          const budget = Math.min(this._room.energyCapacityAvailable, 300);
          const source = this._room.owned.state.resourceState.getSources()[0];

          const adjacentSpots = source.getMinerSpots();
          for (let i = this._current.miners; i < this._required.miners; i++) {
            const pos = adjacentSpots[i];
            const need = new MinerNeed(budget, { pos: pos, sourceId: source.id });
            creepNeeds.creeps.push(need);
          }

          return { creeps: creepNeeds };
        }
      ),

      new StratCondition("Haulers",
        () => {
          this._current.haulers = this._room.owned.state.creepState.getCreepCount(CreepTypes.hauler);
          if (this._current.haulers < this._required.haulers) return StratConditionResult.Failed;
          return StratConditionResult.Passed;
        },

        () => {
          const budget = Math.min(this._room.energyCapacityAvailable, 300);
          const source = this._room.owned.state.resourceState.getSources()[0];
          const spawn = this._room.owned.state.spawn;

          const creepNeeds: ICreepNeeds = { creeps: [] };

          if (this._current.haulers < this._required.haulers) creepNeeds.creeps.push(new HaulerNeed(budget, {
            collectPos: source.pos,
            sourceId: source.id,
            dropOffPos: spawn!.pos
          }));

          return { creeps: creepNeeds };
        }
      ),

      new StratCondition("Scout",
        () => {
          const exits = Object.values(getAdjacentRoomNames(this._room.name));
          const scouts = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.scout);

          if (exits.length && scouts.length !== 1) return StratConditionResult.Failed;
          return StratConditionResult.Passed;
        },

        () => {
          const budget = Math.min(this._room.energyCapacityAvailable, 300);
          const exits = Object.values(getAdjacentRoomNames(this._room.name));
          const drones = this._room.owned.state.creepState.getCreeps(CreepTypes.genericDrone);
          const scouts = this._room.owned.state.taskState.getAllocatedDrones(TaskTypes.scout);

          const creepNeeds: ICreepNeeds = { creeps: [] };
          const taskNeeds: ITaskNeeds = { tasks: [] };

          const scoutingTask = new ScoutingTask({
            pos: new RoomPosition(25, 25, exits[0]),
            roomNames: [],
            priority: TaskPriority.high
          });

          if (!drones.length) {
            creepNeeds.creeps.push(new GenericDroneNeed(budget, {
              task: scoutingTask
            }));
            return { creeps: creepNeeds };
          }

          taskNeeds.tasks.push(scoutingTask);
          return { tasks: taskNeeds };
        }
      )
    ];
  }
}
