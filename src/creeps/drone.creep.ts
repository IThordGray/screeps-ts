import { CreepType } from "classes/controllers/queen.class";
import { ICreep } from "./_abstract.creep";

export class Drone implements ICreep {
  name: (roomName: string) => string = (roomName: string) => `${roomName}.drone.${Math.floor(Math.random() * 1000)}` ;
  creepType: CreepType = "drone";
  ratio: BodyPartConstant[] = [WORK, CARRY, MOVE];
}
