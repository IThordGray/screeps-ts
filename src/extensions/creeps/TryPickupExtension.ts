export const PICKUP_STATE = "pickingUp";
export const pickupStateSwitchAction = (creep: Creep) => creep.say("🧲 picking up");

Object.defineProperty(Creep.prototype, "isPickingUp", {
  get(): boolean {
    return this.memory.state === PICKUP_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? PICKUP_STATE : undefined;
  }
});

Creep.prototype.tryPickup = function(options: TryPickupOptions) {
  const { target, targetId } = options;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  const t = target ?? (targetId ? Game.getObjectById(targetId) : undefined);
  if (!t) return ERR_INVALID_TARGET;

  const code = this.pickup(t);
  if (code === ERR_NOT_IN_RANGE) return this.moveTo(t);

  return code;
};
