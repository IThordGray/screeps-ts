import { CreepTypes } from "../../../abstractions/creep-types";
import { ICreepNeeds, ITaskNeeds } from "../../../abstractions/interfaces";
import { genericDroneCreep } from "../../../creeps/generic-drone";
import { haulerCreep } from "../../../creeps/hauler";
import { minerCreep } from "../../../creeps/miner";
import { getAdjacentRoomNames } from "../../../helpers/get-adjacent-room-names";
import { TaskPriority } from "../../../tasking/taskPriority";
import { ScoutingTask } from "../../../tasking/tasks/scouting.task";
import { TaskTypes } from "../../../tasking/taskTypes";
import { StratConditionResult, StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

export class MiningMilestone extends Milestone {

  private _required = { miners: 1, haulers: 1 };
  private _current = { miners: 0, haulers: 0 };

  init() {
    this._stratConfig.conditions = [
      new StratConfigCondition("Miners",
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
            const need = minerCreep.need(budget, { pos: pos, sourceId: source.id });
            creepNeeds.creeps.push(need);
          }

          return { creeps: creepNeeds };
        }
      ),

      new StratConfigCondition("Haulers",
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

          if (this._current.haulers < this._required.haulers) creepNeeds.creeps.push(haulerCreep.need(budget, {
            collectPos: source.pos,
            sourceId: source.id,
            dropOffPos: spawn!.pos
          }));

          return { creeps: creepNeeds };
        }
      ),

      new StratConfigCondition("Scout",
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
            creepNeeds.creeps.push(genericDroneCreep.need(budget, {
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
