import { Task } from "../tasking/task";
import { CreepType } from "./creep-types";

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

export interface IRequirements {
  getCreepRequirements(): ICreepRequirements[];

  getTaskRequirements(): Task[];
}

export interface IStrat extends IRequirements {

  isDone(): boolean;

  update(): void;
}

export interface ICreepRequirements {
  creepType: string;
  budget: number;
  memory?: Record<string, any> | undefined;
}