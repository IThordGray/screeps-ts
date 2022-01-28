import { Drone } from "creeps/drone.creep";
import { ICreep } from "creeps/_abstract.creep";
import { ActionStatus } from "../milestone.class";
import { CreepType, Queen } from "./queen.class";

const CreepsMapper: Record<CreepType, ICreep> = {
  drone: new Drone()
};

export type CreepCount = Record<CreepType, string[]>;

export class Hatchery {

  private _creepCount = new Map<CreepType, string[]>();

  private _creeps: Record<string, { type: CreepType; ref: Creep }> = {};

  constructor(private _queen: Queen) {}

  private getBodyParts(ratio: BodyPartConstant[], multiplier: number): BodyPartConstant[] {
    const ratioLength = ratio.length;
    const bodyPartLength = multiplier * ratioLength;
    let bodyArr = new Array(bodyPartLength);

    for (let i = 0; i < bodyPartLength; i++) bodyArr[i] = ratio[i % ratioLength];
    return bodyArr;  }

  getCreepCount(type: CreepType): number;
  getCreepCount(): CreepCount;
  getCreepCount(arg?: CreepType): number | CreepCount {
    if (!arg) {
      for (const iterator of object) {

      }
    }

    if (!arg) return Object.fromEntries(this._creepCount) as CreepCount;
    return this._creepCount.get(arg) ?? 0;
  }

  spawn(creepType: CreepType): ActionStatus {
    const creep = CreepsMapper[creepType];
    const cost = creep.ratio.reduce((pv, cv) => (pv += BODYPART_COST[cv]), 0);
    const multiplier = Math.floor(this._queen.spawn.store.energy / cost);
    const body = this.getBodyParts(creep.ratio, multiplier);
    const result = this._queen.spawn.spawnCreep(creep.ratio, creep.name(this._queen.spawn.room.name));
    if (result === ERR_BUSY) return "IN_PROGRESS";
    if (result === OK) {
      this._;
      return "SUCCESS";
    }
    return "FAILURE";
  }
}
