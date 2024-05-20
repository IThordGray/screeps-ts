import { ICreepRequirements } from "../../../abstractions/interfaces";
import { gameState, RoomState } from "../../../singletons/game-state";
import { Task } from "../../../tasking/task";
import { TaskAllocator } from "../../../tasking/taskAllocator";
import { IMilestone } from "../milestone.interface";

export abstract class Milestone implements IMilestone {
  protected _roomName: string;
  protected _taskAllocator: TaskAllocator;

  constructor(roomName: string, taskAllocator: TaskAllocator) {
    this._roomName = roomName;
    this._taskAllocator = taskAllocator;
  }

  abstract condition(): boolean;

  abstract getCreepRequirements(): ICreepRequirements[];

  abstract getTaskRequirements(): Task[];

  abstract update(): void;

}