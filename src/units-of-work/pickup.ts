export interface IMemoryCanPickup {

}

type PickupArgs = {
  getPosition: (creep: Creep) => RoomPosition | undefined,
  getTarget: (creep: Creep) => Resource | undefined;
};

export class Pickup {
  static state = "pickingUp";
  static action = (creep: Creep) => creep.say("🧲 picking up");

  private readonly _getPosition: PickupArgs["getPosition"];
  private readonly _getTarget: PickupArgs["getTarget"];

  constructor(args: PickupArgs) {
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

    const target = this._getTarget(creep);
    if (!target) return;

    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
