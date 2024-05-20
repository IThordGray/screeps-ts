export interface IMemoryCanWithdraw {

}

type WithDrawArgs = {
  getPosition: (creep: Creep) => RoomPosition | undefined,
  getTarget?: (creep: Creep) => Id<AnyStructure> | undefined
};

export class Withdraw {
  static state = "withdrawing";
  static action = (creep: Creep) => creep.say("🧲 withdrawing");

  private readonly _getPosition: WithDrawArgs["getPosition"];
  private readonly _getTarget: WithDrawArgs["getTarget"];

  constructor(args: WithDrawArgs) {
    this._getPosition = args.getPosition;
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const pos = this._getPosition(creep);
    if (!pos) return;

    if (creep.room.name !== pos.roomName) {
      creep.moveTo(pos);
      return;
    }

    const targetId = this._getTarget?.(creep);
    const structure = targetId ? Game.getObjectById(targetId) : null;

    if (structure && (creep.withdraw(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)) {
      creep.moveTo(structure, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  }
}
