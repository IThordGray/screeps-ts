export const UPGRADE_STATE = "upgrading";
export const upgradeStateSwitchAction = (creep: Creep) => creep.say("⬆️ upgrade");

Object.defineProperty(Creep.prototype, "isUpgrading", {
  get(): boolean {
    return this.memory.state === UPGRADE_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? UPGRADE_STATE : undefined;
  }
});

Creep.prototype.tryUpgrade = function(options: TryUpgradeOptions) {
  const { target, targetId } = options;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  if (target) {
    const code = this.upgradeController(target);
    if (code === ERR_NOT_IN_RANGE) return this.moveTo(target);
    return code;
  }

  const targetById = Game.getObjectById(targetId!);
  if (!targetById) return ERR_INVALID_TARGET;

  const code = this.upgradeController(targetById);
  if (code === ERR_NOT_IN_RANGE) this.moveTo(targetById);

  return code;
};