import { CreepTypes } from "../../../abstractions/creep-types";
import { ICreepNeeds, ITaskNeeds } from "../../../abstractions/interfaces";
import { haulerCreep } from "../../../creeps/hauler";
import { minerCreep } from "../../../creeps/miner";
import { getAdjacentRoomNames } from "../../../helpers/get-adjacent-room-names";
import { ScoutingTask } from "../../../tasking/tasks/scouting.task";
import { TaskType } from "../../../tasking/taskType";
import { StratConfigCondition } from "../stratConfigCondition";
import { Milestone } from "./milestone";

// Create another 2 drones per extra source.
// Create a miner / hauler pair for each source in the room.
// Take one drone from each source and reallocate them to Scouting tasks
export class MiningMilestone extends Milestone {

  private _required = { miners: 1, haulers: 1 };
  private _current = { miners: 0, haulers: 0 };

  init() {
    this._stratConfig.conditions = [];
    this._stratConfig.conditions.push(new StratConfigCondition(
      () => {
        this._current.miners = this._room.owned.state.creepState.getCreepCount(CreepTypes.miner);
        if (this._current.miners < this._required.miners) return false;

        this._current.haulers = this._room.owned.state.creepState.getCreepCount(CreepTypes.hauler);
        if (this._current.haulers < this._required.haulers) return false;

        return true;
      },

      () => {
        const budget = this._room.energyCapacityAvailable;
        const source = this._room.owned.state.resourceState.getSources()[0];
        const spawn = this._room.owned.state.spawn;

        const creepNeeds: ICreepNeeds = { creeps: [] };
        const taskNeeds: ITaskNeeds = { tasks: [] };

        if (this._current.miners < this._required.miners) creepNeeds.creeps.push(minerCreep.need(budget, {
          pos: source.pos,
          sourceId: source.id
        }));

        if (this._current.haulers < this._required.haulers) creepNeeds.creeps.push(haulerCreep.need(budget, {
          collectPos: source.pos,
          sourceId: source.id,
          dropOffPos: spawn!.pos
        }));

        const exits = Object.values(getAdjacentRoomNames(this._room.name));
        const scouts = this._taskAllocator.getAllocatedDrones(TaskType.scout);

        const minerRequirementMet = this._current.miners === this._required.miners;
        const haulerRequirementMet = this._current.haulers === this._required.haulers;

        if (minerRequirementMet && haulerRequirementMet && !!exits.length && !scouts.length) {
          taskNeeds.tasks.push(new ScoutingTask({ pos: new RoomPosition(25, 25, exits[0]), roomNames: [] }));
        }

        return { creeps: creepNeeds, tasks: taskNeeds };
      }
    ));
  }
}
