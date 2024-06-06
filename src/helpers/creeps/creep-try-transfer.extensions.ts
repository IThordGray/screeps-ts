export const TRANSFERRING_STATE = "transferring";
export const transferStateSwitchAction = (creep: Creep) => creep.say("🧲 transferring");

Object.defineProperty(Creep.prototype, "isTransferring", {
  get(): boolean {
    return this.memory.state === TRANSFERRING_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? TRANSFERRING_STATE : undefined;
  }
});

Creep.prototype.tryTransfer = function(options: TryTransferOptions) {
  const { target, targetId, amount } = options;
  const resource = options.resource ?? RESOURCE_ENERGY;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  const t = target ?? (targetId ? Game.getObjectById(targetId) : undefined);
  if (!t) return ERR_INVALID_TARGET;

  const code = this.transfer(t, resource, amount);
  if (code === ERR_NOT_IN_RANGE) return this.moveTo(t);

  return code;
};
