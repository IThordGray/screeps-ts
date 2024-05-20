import { Task } from "../tasking/task";
import { TaskExecutor } from "../tasking/taskExecutor";

export interface IMemoryCanDoTask {
  task: Task;
}

export type DoTaskArgs = {
  getTask: (creep: Creep) => Task | undefined;
  getTaskExecutor: (task: Task) => TaskExecutor<any> | undefined;
};

export class DoTask {
  static state = "working";
  static action = (creep: Creep) => creep.say("Working");

  private readonly _getTask: DoTaskArgs["getTask"];
  private readonly _getTaskExecutor: DoTaskArgs["getTaskExecutor"];

  constructor(args: DoTaskArgs) {
    this._getTask = args.getTask;
    this._getTaskExecutor = args.getTaskExecutor;
  }

  run(creep: Creep) {
    const task = this._getTask(creep);
    if (!task) return;

    const executor = this._getTaskExecutor(task);
    if (!executor) return;

    executor.run(creep);
  }
}