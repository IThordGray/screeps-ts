export const HARVEST_STATE = "harvesting";
export const harvestStateSwitchAction = (creep: Creep) => creep.say("⛏️ harvesting");

Object.defineProperty(Creep.prototype, "isHarvesting", {
  get(): boolean {
    return this.memory.state === HARVEST_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? HARVEST_STATE : undefined;
  }
});

Creep.prototype.tryHarvest = function(options: TryHarvestOptions) {
  const tryHarvestRemote = (options: TryHarvestRemoteRoomOptions) => {
    const { room } = this;
    const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;

    if (pos && room.name !== pos.roomName) return this.moveTo(pos);

    const target = Game.getObjectById(options.targetId);
    if (!target) return ERR_INVALID_TARGET;

    const code = this.harvest(target);
    if (code === ERR_NOT_IN_RANGE) return this.moveTo(target);

    return code;
  };

  const tryHarvestRoom = (options: TryHarvestRoomOptions) => {
    const { target } = options;

    const code = this.harvest(target);
    if (code === ERR_NOT_IN_RANGE) return this.moveTo(target);

    return code;
  };

  return "targetId" in options
    ? tryHarvestRemote(options)
    : tryHarvestRoom(options);
};
