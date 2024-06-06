export const SCOUT_STATE = "delivering";
export const scoutStateSwitchAction = (creep: Creep) => creep.say("🚧 scout");

Object.defineProperty(Creep.prototype, "isScouting", {
  get(): boolean {
    return this.memory.state === SCOUT_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? SCOUT_STATE : undefined;
  }
});