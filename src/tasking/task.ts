import { generateUID } from "../helpers/generate-uid";
import { TaskPriority } from "./taskPriority";
import { TaskType } from "./taskType";

export type TaskArgs = { pos: RoomPosition;  priority?: TaskPriority }
export abstract class Task {
  readonly abstract type: TaskType;

  readonly id = generateUID();
  readonly priority: TaskPriority;
  readonly pos: RoomPosition;

  protected constructor(args: TaskArgs) {
    this.pos = args.pos;
    this.priority = args.priority ?? TaskPriority.medium;
  }
}

