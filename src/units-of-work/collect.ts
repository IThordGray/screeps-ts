import { Pickup } from "./pickup";
import { Withdraw } from "./withdraw";

export class Collect {
  static state = 'collecting';
  static action = (creep: Creep) => creep.say("🔄 collect");

  private _target?: RoomPosition | null;

  private readonly _getTarget: (creep: Creep) => RoomPosition | null;

  private readonly _pickup = new Pickup({
    getTarget: (creep: Creep) => {
      const pos = this._getTarget(creep);
      if (!pos) return null;

      return pos.findInRange(FIND_DROPPED_RESOURCES, 5)[0];
    }
  });

  private readonly _withdraw = new Withdraw({
    getTarget: (creep: Creep) => {
      const pos = this._getTarget(creep);
      if (!pos) return null;

      return pos.findInRange(FIND_STRUCTURES, 5, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      })[0];
    }
  });

  constructor(args: {
    getTarget: (creep: Creep) => RoomPosition | null
  }) {

    this._getTarget = (creep: Creep) => {
      if (this._target !== undefined) return this._target;
      this._target = args.getTarget(creep);
      return this._target;
    };
  }

  run(creep: Creep) {
    this._pickup.run(creep);
    this._withdraw.run(creep);
  }
}
