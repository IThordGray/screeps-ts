import { PosUtils } from "../../utils/pos.utils";

export const DROPPING_STATE = "dropping";
export const dropStateSwitchAction = (creep: Creep) => creep.say("🧲 dropping");

Object.defineProperty(Creep.prototype, "isDropping", {
  get(): boolean {
    return this.memory.state === DROPPING_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? DROPPING_STATE : undefined;
  }
});

Creep.prototype.tryDrop = function(options: TryDropOptions) {
  const { resource, amount } = options;
  const pos = PosUtils.new(options.pos);

  if (!pos) return ERR_INVALID_TARGET;

  if (!pos.isEqualTo(this.pos)) return this.moveTo(pos);

  return this.drop(resource ?? RESOURCE_ENERGY, amount);
};
