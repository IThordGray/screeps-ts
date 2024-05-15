import { Task } from "../classes/task";

export interface OnInit {
  init(): void;
}

export interface OnUpdate {
  update(): void;
}

export interface OnRun {
  run(): void;
}

export interface OnDispose {
  dispose(): void;
}

export interface CanPerformTask {
  canPerformTask(task: Task): boolean;
}
