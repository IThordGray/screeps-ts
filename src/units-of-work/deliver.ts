export interface IMemoryCanDeliver {
  dropOffPos: RoomPosition;
}

export type DeliverArgs = {
  getPosition: (creep: Creep) => RoomPosition | null,
  getTarget?: (creep: Creep) => Id<AnyStructure> | null
};

export class Deliver {
  static state = "delivering";
  static action = (creep: Creep) => creep.say("🚚 deliver");
  static defaultTarget = (creep: Creep) => {
    const target = creep.room.storage || creep.room.terminal || creep.room.find(FIND_STRUCTURES, {
      filter: (s => (
        (s.structureType === STRUCTURE_EXTENSION ||
          s.structureType === STRUCTURE_SPAWN ||
          s.structureType === STRUCTURE_TOWER) &&
        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      ))
    })[0];

    return target?.id;
  };
  private readonly _getPosition: DeliverArgs["getPosition"];
  private readonly _getTarget: DeliverArgs["getTarget"];

  constructor(args: DeliverArgs) {
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

    if (!structure) {
      creep.moveTo(pos);
      return;
    }

    if (structure && (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)) {
      creep.moveTo(structure, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  }
}
