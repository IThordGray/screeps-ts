import { checkDistance } from "helpers/check-distance";
import { GoTo } from "./go-to";
import { Harvest } from "./harvest";

export class LDHarvest {

  private _getTarget: (creep: Creep) => ({ pos: RoomPosition, sourceId: Id<Source> }) | null;

  private readonly _goTo = new GoTo({
    getTarget: (creep: Creep) => {
      const target = this._getTarget(creep);
      if (!target) return null;

      return target.pos;
    }
  });

  private readonly _harvest = new Harvest({
    getTarget: (creep: Creep) => {
      const target = this._getTarget(creep);
      if (!target) return null;

      return new Source(target.sourceId);
    }
  });

  constructor(args: {
    getTarget: (creep: Creep) => ({ pos: RoomPosition, sourceId: Id<Source> }) | null
  }) {
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const target = this._getTarget(creep);
    if (!target) return;

    if (creep.room.name !== target.pos.roomName) return this._goTo.run(creep);
    if (!checkDistance(creep.pos, target.pos, 1)) return this._goTo.run(creep);
    return this._harvest.run(creep);
  }
}
