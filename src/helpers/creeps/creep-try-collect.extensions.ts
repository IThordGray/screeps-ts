export const COLLECT_STATE = "collecting";
export const collectStateSwitchAction = (creep: Creep) => creep.say("🔄 collecting");

Object.defineProperty(Creep.prototype, "isCollecting", {
  get(): boolean {
    return this.memory.state === COLLECT_STATE;
  },
  set(value: boolean) {
    this.memory.state = !!value ? COLLECT_STATE : undefined;
  }
});

Creep.prototype.tryCollect = function(options: TryCollectOptions) {
  const { target, targetId, amount } = options;
  const pos = options.pos ? new RoomPosition(options.pos.x, options.pos.y, options.pos.roomName) : options.pos;
  const scavengeRange = options.scavengeRange ?? 5;
  const resource = options.resource ?? RESOURCE_ENERGY;

  const tryCollectFromTarget = () => {
    if (target) {
      if (target instanceof Resource) return this.tryPickup({ target });
      return this.tryWithdraw({ target, resource, amount });
    }

    const targetFromId = Game.getObjectById(targetId!);
    if (!targetFromId) return ERR_INVALID_TARGET;

    if (targetFromId instanceof Resource) return this.tryPickup({ target: targetFromId });
    return this.tryWithdraw({ target: targetFromId, resource, amount });
  };

  const tryCollectFromPosition = () => {
    const droppedResources = pos?.findInRange(FIND_DROPPED_RESOURCES, scavengeRange) ?? [];
    droppedResources.sort((a, b) => b.amount - a.amount);

    const containers: StructureContainer[] = pos?.findInRange(FIND_STRUCTURES, scavengeRange, {
      filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[resource] > 50
    }) ?? [];
    containers.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());

    if (droppedResources[0]?.amount >= 50) return this.tryPickup({ target: droppedResources[0] });

    if (!containers[0]) return ERR_INVALID_TARGET;
    return this.tryWithdraw({ target: containers[0], resource, amount });
  };

  if (!pos && !target && !targetId) return ERR_INVALID_TARGET;

  if (pos && pos.roomName !== this.pos.roomName) return this.moveTo(pos);

  if (target || targetId) return tryCollectFromTarget();
  return tryCollectFromPosition();
};
