export class Withdraw {
  static action = (creep: Creep) => creep.say("🧲 withdrawing");

  private _getTarget: (creep: Creep) => AnyStructure | null;

  constructor(args: {
    getTarget: (creep: Creep) => AnyStructure | null;
  }) {
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const target = this._getTarget(creep);
    if (!target) return;

    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
