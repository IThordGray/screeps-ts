import { Pickup } from "./pickup";
import { Withdraw } from "./withdraw";

export class Collect {
  static action = (creep: Creep) => creep.say("🔄 collect");

  private _target?: Source | null;

  private readonly _getTarget: (creep: Creep) => Source | null;

  private readonly _pickup = new Pickup({
    getTarget: (creep: Creep) => {
      const source = this._getTarget(creep);
      if (!source) return null;

      return source.pos.findInRange(FIND_DROPPED_RESOURCES, 5)[0];
    }
  });

  private readonly _withdraw = new Withdraw({
    getTarget: (creep: Creep) => {
      const source = this._getTarget(creep);
      if (!source) return null;

      return source.pos.findInRange(FIND_STRUCTURES, 5, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      })[0];
    }
  });

  constructor(args: {
    getTarget: (creep: Creep) => Source | null
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
