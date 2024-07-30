import { generateUniqueCode } from "../helpers/generate-uid";
import { Type } from "../utils/type.type";

export type CreepExecutorArgs<T extends Creep> = { creep: T }

export abstract class BaseCreep {
  private bodyParts: BodyPartConstant[];
  readonly body: BodyPartConstant[];
  readonly name: string;
  readonly memory: CreepMemory;

  protected get minCost() {
    return this.bodyParts.reduce((p, c) => p += BODYPART_COST[c], 0);
  }

  protected constructor(creepType: CreepType, bodyParts: BodyPartConstant[], budget: number, memory: CreepMemory) {
    this.bodyParts = bodyParts;
    this.name = this.getName(creepType);
    this.body = this.getBody(budget);
    this.memory = { ...memory, type: creepType };
  }

  getBody(budget: number) {
    let body = [ ...this.bodyParts ];
    let currentCost = this.minCost;

    let index = 0;
    while ((currentCost + BODYPART_COST[this.bodyParts[index % this.bodyParts.length]]) <= budget) {
      body.push(this.bodyParts[index % this.bodyParts.length]);
      currentCost += BODYPART_COST[this.bodyParts[index % this.bodyParts.length]];
      index++;
    }

    return body;
  };

  getName(prefix: string) {
    return `${ prefix } ${ generateUniqueCode() }`;
  };
}

export abstract class CreepExecutor<T extends Creep> {
  readonly creep: T;

  constructor(args: CreepExecutorArgs<T>) {
    this.creep = args.creep;
  }

  abstract run(): void;
}

export class CreepExecutorLoader {
  private static _creepExecutors: { [creepType: string]: Type<CreepExecutor<Creep>> } = {};

  static get(creep: Creep) {
    const executor = this._creepExecutors[creep.memory.type];
    if (!executor) return;

    return new executor({ creep });
  }

  static register(creepType: CreepType, executor: Type<CreepExecutor<any>>) {
    this._creepExecutors[creepType] = executor;
  }
}