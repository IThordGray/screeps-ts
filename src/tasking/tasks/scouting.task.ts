import { TaskTypes } from "../taskTypes";
import { DroneMemory } from "../../creeps/generic-drone";
import { IMemoryCanScout, Scout } from "../../units-of-work/scout";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";

export type ScoutingTaskArgs = { roomNames: string[] } & TaskArgs;

export class ScoutingTask extends Task implements IMemoryCanScout {
  override type = TaskTypes.scout;
  readonly roomNames: string[];

  constructor(args: ScoutingTaskArgs) {
    super(args);

    this.roomNames = args.roomNames;
  }
}

export class ScoutingTaskExecutor extends TaskExecutor<ScoutingTask> {
  private readonly _scout = new Scout({
    getPosition: () => this.task.pos,
    getNewPosition: (creep: Creep) => {
      const roomName = this.task.roomNames.shift();
      if (!roomName) {
        (creep.memory as DroneMemory).task = undefined as any;
        return;
      }

      return new RoomPosition(25, 25, roomName);
    }
  });

  run(creep: Creep): void {
    this._scout.run(creep);
  }
}