import { BaseTask, TaskExecutor } from "../tasking/BaseTask";

export interface IMemoryCanDoTask {
  task: BaseTask;
}

export type DoTaskArgs = {
  getTask: (creep: Creep) => BaseTask | undefined;
  getTaskExecutor: (task: BaseTask) => TaskExecutor<any> | undefined;
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