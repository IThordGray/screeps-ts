import { Pickup } from "./pickup";
import { Withdraw } from "./withdraw";

export interface IMemoryCanCollect {
  collectPos: RoomPosition;
}

export type CollectArgs = {
  getPosition: (creep: Creep) => RoomPosition | undefined
};

export class Collect {
  static state = "collecting";
  static action = (creep: Creep) => creep.say("🔄 collecting");

  private readonly _getPosition: CollectArgs["getPosition"];

  private readonly _pickup = new Pickup({
    getPosition: (creep: Creep) => this._getPosition(creep),
    getTarget: creep => {
      const pos = this._getPosition(creep);
      if (!pos) return;

      return pos.findInRange(FIND_DROPPED_RESOURCES, 5)?.[0];
    }
  });

  private readonly _withdraw = new Withdraw({
    getPosition: (creep: Creep) => this._getPosition(creep),
    getTarget: (creep: Creep) => {
      const pos = this._getPosition(creep);
      if (!pos) return;

      return pos.findInRange(FIND_STRUCTURES, 5, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      })?.[0]?.id;
    }
  });

  constructor(args: CollectArgs) {
    this._getPosition = args.getPosition;
  }

  run(creep: Creep) {
    this._pickup.run(creep);
    this._withdraw.run(creep);
  }
}
