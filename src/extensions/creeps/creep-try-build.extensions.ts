import { BuildingType } from "../../singletons/buildPlanner";

export const BUILD_STATE = "building";
export const buildStateSwitchAction = (creep: Creep) => creep.say("🚧 build");

Object.defineProperty(Creep.prototype, "isBuilding", {
  get(): boolean {
    return this.memory.state === BUILD_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? BUILD_STATE : undefined;
  }
});

Creep.prototype.tryBuild = function(options: TryBuildOptions) {
  const { target, targetId } = options;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;

  const tryBuildAnythingInRoom = () => {
    const targets = Game.rooms[pos!.roomName]!.find(FIND_CONSTRUCTION_SITES);

    const priorityMap: { [key in BuildingType]?: ConstructionSite[] } = {};

    for (const target of targets) {
      priorityMap[target.structureType] ??= [];
      priorityMap[target.structureType]?.push(target);
    }

    const priorities = [
      STRUCTURE_SPAWN,
      STRUCTURE_EXTENSION,
      STRUCTURE_TOWER,
      STRUCTURE_STORAGE,
      STRUCTURE_CONTAINER,
      STRUCTURE_ROAD,
      STRUCTURE_WALL,
      STRUCTURE_RAMPART,
      STRUCTURE_LAB,
      STRUCTURE_TERMINAL,
      STRUCTURE_LINK,
      STRUCTURE_FACTORY,
      STRUCTURE_OBSERVER,
      STRUCTURE_NUKER,
      STRUCTURE_POWER_SPAWN
    ];

    for (const structureType of priorities) {
      if (priorityMap[structureType]) {
        return this.tryBuild({ target: priorityMap[structureType]?.[0] });
      }
    }

    return ERR_INVALID_TARGET;
  };

  const tryBuildTarget = () => {
    if (target) {
      const code = this.build(target);
      if (code === ERR_NOT_IN_RANGE) return this.moveTo(target);
      return code;
    }

    const targetFromId = Game.getObjectById(targetId!);
    if (!targetFromId) return ERR_INVALID_TARGET;

    const code = this.build(targetFromId);
    if (code === ERR_NOT_IN_RANGE) return this.moveTo(targetFromId);
    return code;
  };

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  if (target || targetId) return tryBuildTarget();
  return tryBuildAnythingInRoom();

};