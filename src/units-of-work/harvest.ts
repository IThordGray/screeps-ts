export type IMemoryCanHarvest = {
  pos: RoomPosition;
  sourceId: Id<Source>;
}

export type HarvestArgs = {
  getPosition: (creep: Creep) => RoomPosition,
  getTarget: (creep: Creep) => Source | null
};

export class Harvest {
  static state = 'harvesting';
  static action = (creep: Creep) => creep.say("⛏️ harvesting");

  private readonly _getPosition: HarvestArgs["getPosition"];
  private readonly _getTarget: HarvestArgs["getTarget"];

  constructor(args: HarvestArgs) {
    this._getPosition = args.getPosition;
    this._getTarget = args.getTarget;
  }

  run(creep: Creep) {
    const pos = this._getPosition(creep);
    if (!pos) return;

    if (creep.room.name !== pos.roomName) creep.moveTo(pos);
    const source = this._getTarget(creep);
    if (!source) return;

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source, { visualizePathStyle: { stroke: "#ffffff" } });
  }
}
