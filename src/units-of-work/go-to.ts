export class GoTo {

  private _getTarget: (creep: Creep) => RoomPosition | null;

  constructor(args: {
    getTarget: (creep: Creep) => RoomPosition | null
  }) {
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const target = this._getTarget(creep);
    if (!target) return;

    creep.moveTo(target);
  }
}
