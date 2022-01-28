import { ITask } from "classes/task.class";
import { Queen } from "./queen.class";

export class Delegator {
  creepTasks: Record<string, ITask> = {};

  constructor(private _queen: Queen) {}
}
