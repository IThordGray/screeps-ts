import { Task } from "../tasking/Task";

export interface ICreepNeeds {
  creeps: ICreepRequirement[];
}

// export interface IStructureNeeds {
//   structures:
// }

export interface IControllerNeeds {
}

export interface ITaskNeeds {
  tasks: Task[];
}

export interface IStratNeeds {
  creeps?: ICreepNeeds;
  // structures?: IStructureNeeds;
  tasks?: ITaskNeeds;
  controller?: IControllerNeeds;
}