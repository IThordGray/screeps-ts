import { Task } from "./task";

export type TaskExecutorArgs<T extends Task> = { task: T }

export abstract class TaskExecutor<T extends Task> {
  readonly task: T;

  constructor(args: TaskExecutorArgs<T>) {
    this.task = args.task;
  }

  abstract run(creep: Creep): void;
}