import { generateUID } from "../helpers/generate-uid";
import { Type } from "../helpers/type";
import { TaskPriority } from "./TaskPriority";

export type TaskArgs = { pos: RoomPosition; priority?: TaskPriority }

export type TaskExecutorArgs<T extends BaseTask> = { task: T }

export abstract class BaseTask implements ITask {
  abstract readonly type: TaskType;

  readonly id = generateUID();
  readonly priority: TaskPriority;
  readonly pos: RoomPosition;

  protected constructor(args: TaskArgs) {
    this.pos = args.pos;
    this.priority = args.priority ?? TaskPriority.medium;
  }
}

export abstract class TaskExecutor<T extends BaseTask> {
  readonly task: T;

  constructor(args: TaskExecutorArgs<T>) {
    this.task = args.task;
  }

  abstract run(creep: Creep): void;
}

export class TaskExecutorLoader {
  private static _taskExecutors: { [taskType: string]: Type<TaskExecutor<BaseTask>> } = {};

  static get(task: BaseTask) {
    const executor = this._taskExecutors[task.type];
    if (!executor) return;

    return new executor({ task });
  }

  static register(taskType: TaskType, executor: Type<TaskExecutor<any>>) {
    this._taskExecutors[taskType] = executor;
  }
}