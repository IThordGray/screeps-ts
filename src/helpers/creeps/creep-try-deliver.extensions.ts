export const DELIVER_STATE = "delivering";
export const deliverStateSwitchAction = (creep: Creep) => creep.say("🚚 deliver");

Object.defineProperty(Creep.prototype, "isDelivering", {
  get(): boolean {
    return this.memory.state === DELIVER_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? DELIVER_STATE : undefined;
  }
});

Creep.prototype.tryDeliver = function(options: TryDeliverOptions) {
  const { target, targetId, amount } = options;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;
  const resource = options.resource ?? RESOURCE_ENERGY;
  const dumpRange = options.dumpRange ?? 5;

  const tryDeliverToTarget = () => {
    if (target) return this.tryTransfer({ target, resource, amount });

    const targetFromId = Game.getObjectById(targetId!);
    if (!targetFromId) return ERR_INVALID_TARGET;

    return this.tryTransfer({ target, resource, amount });
  };

  const tryDropOffAtPosition = () => {
    const creeps = pos?.findInRange(FIND_MY_CREEPS, dumpRange, {
      filter: x => x.isBuilding || x.isUpgrading && x.store.getFreeCapacity() > 50
    }) ?? [];
    creeps.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());

    const structures: StructureStorage[] = pos?.findInRange(FIND_STRUCTURES, dumpRange, {
      filter: x => {
        const viableTargets = [ STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER ];
        return viableTargets.some(t => t === x.structureType) && (x as StructureStorage).store.getFreeCapacity(resource) > 50;
      }
    }) ?? [];
    structures.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());

    if (structures[0]) return this.tryTransfer({ target: structures[0], amount, resource });
    if (creeps[0]) return this. tryTransfer({ target: creeps[0], amount, resource });
    return this.tryDrop({ pos, amount, resource });
  };

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  if (target || targetId) return tryDeliverToTarget();
  return tryDropOffAtPosition();
};