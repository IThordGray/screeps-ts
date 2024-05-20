import { Logger } from "../helpers/logger";
import { Type } from "../helpers/type";
import { Task } from "./task";
import { TaskExecutor } from "./taskExecutor";
import { HarvestTaskExecutor } from "./tasks/harvest.task";
import { HaulerTaskExecutor } from "./tasks/hauler.task";
import { TaskType } from "./taskType";

export class TaskExecutorLoader {
  private static _taskExecutors: { [taskType: string]: Type<TaskExecutor<Task>> } = {
    // [TaskType.build]: BuildTaskExecutor,
    // [TaskType.defend]: DefendTaskExecutor,
    [TaskType.harvest]: HarvestTaskExecutor,
    [TaskType.haul]: HaulerTaskExecutor
    // [TaskType.repair]: RepairTaskExecutor,
    // [TaskType.scout]: ScoutTaskExecutor

  };

  static get(task: Task) {
    const executor = this._taskExecutors[task.type];
    if (!executor) return;

    return new executor({ task });
  }
}