import { Logger } from "../helpers/logger";
import { Type } from "../helpers/type";
import { Task } from "./task";
import { TaskExecutor } from "./taskExecutor";
import { BuildTaskExecutor } from "./tasks/build.task";
import { HarvestTaskExecutor } from "./tasks/harvest.task";
import { HaulerTaskExecutor } from "./tasks/hauler.task";
import { UpgradeTaskExecutor } from "./tasks/upgrade.task";
import { TaskTypes } from "./taskTypes";

export class TaskExecutorLoader {
  private static _taskExecutors: { [taskType: string]: Type<TaskExecutor<Task>> } = {
    // [TaskType.build]: BuildTaskExecutor,
    // [TaskType.defend]: DefendTaskExecutor,
    [TaskTypes.harvest]: HarvestTaskExecutor,
    [TaskTypes.haul]: HaulerTaskExecutor,
    [TaskTypes.upgrade]: UpgradeTaskExecutor,
    [TaskTypes.build]: BuildTaskExecutor

    // [TaskType.repair]: RepairTaskExecutor,
    // [TaskType.scout]: ScoutTaskExecutor

  };

  static get(task: Task) {
    const executor = this._taskExecutors[task.type];
    if (!executor) return;

    return new executor({ task });
  }
}