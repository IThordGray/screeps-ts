export interface IMemoryCanGoTo {

}

export class GoTo {

  private readonly _getTarget: (creep: Creep) => RoomPosition | null;

  constructor(args: {
    getTarget: (creep: Creep) => RoomPosition | null
  }) {
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const target = this._getTarget(creep);
    if (!target) return;

    creep.moveTo(new RoomPosition(target.x, target.y, target.roomName));
  }
}
