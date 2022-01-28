import { CreepType } from "classes/controllers/queen.class";

export interface ICreep {
  creepType: CreepType;
  ratio: BodyPartConstant[];
  name: (...args: any[]) => string;
}
