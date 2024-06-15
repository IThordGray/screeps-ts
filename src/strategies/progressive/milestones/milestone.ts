import { Task } from "../../../tasking/task";
import { StratConfig } from "../progressive.strat";

export abstract class Milestone {

  protected _taskRequirements: Task[] = [];
  protected _creepRequirement?: ICreepRequirement;

  protected _room: Room;
  protected _stratConfig: StratConfig;

  constructor(room: Room, config: StratConfig) {
    this._room = room;
    this._stratConfig = config;

    this.init();
  }

  abstract init(): void
}