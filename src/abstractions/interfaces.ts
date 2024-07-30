import { BaseTask } from "../tasking/BaseTask";

export interface ICreepNeeds {
  creeps: ICreepRequirement[];
}

// export interface IStructureNeeds {
//   structures:
// }

export interface IControllerNeeds {
}

export interface ITaskNeeds {
  tasks: BaseTask[];
}

export interface IStratNeeds {
  creeps?: ICreepNeeds;
  // structures?: IStructureNeeds;
  tasks?: ITaskNeeds;
  controller?: IControllerNeeds;
}