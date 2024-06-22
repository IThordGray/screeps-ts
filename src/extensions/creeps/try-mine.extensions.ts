import { PosUtils } from "../../utils/pos.utils";

export const MINE_STATE = "mining";
export const harvestStateSwitchAction = (creep: Creep) => creep.say("⛓️ mining");

Object.defineProperty(Creep.prototype, "isMining", {
  get(): boolean {
    return this.memory.state === MINE_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? MINE_STATE : undefined;
  }
});

Creep.prototype.tryMine = function(options: TryMineOptions) {
  const { target, targetId } = options;
  const pos = PosUtils.new(options.pos);

  if (!pos && (!target || !targetId)) return ERR_INVALID_TARGET;
  if (pos && !pos?.isEqualTo(this.pos)) return this.moveTo(pos);

  if (target) return this.harvest(target);

  const targetFromId = Game.getObjectById(targetId!);
  if (!targetFromId) return ERR_INVALID_TARGET;

  return this.harvest(targetFromId);
};
