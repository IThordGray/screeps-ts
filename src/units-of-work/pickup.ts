export class Pickup {
  static action = (creep: Creep) => creep.say("🧲 collecting");

  private _getTarget: (creep: Creep) => Resource | null;

  constructor(args: {
    getTarget: (creep: Creep) => Resource | null;
  }) {
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const target = this._getTarget(creep);
    if (!target) return;

    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
