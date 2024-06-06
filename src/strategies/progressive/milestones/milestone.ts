import { Task } from "../../../tasking/task";
import { StratConfig } from "../progressive.strat";

export abstract class Milestone {

  protected _taskRequirements: Task[] = [];
  protected _creepRequirement?: ICreepRequirement;

  protected _room: Room;
  protected _taskAllocator: ITaskAllocator;
  protected _stratConfig: StratConfig;

  constructor(room: Room, taskAllocator: ITaskAllocator, config: StratConfig) {
    this._room = room;
    this._taskAllocator = taskAllocator;
    this._stratConfig = config;

    this.init();
  }

  abstract init(): void
}