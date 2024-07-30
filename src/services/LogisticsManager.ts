export class Destination {
  readonly id: string;
  readonly pos: RoomPosition;

  constructor(pos: RoomPosition) {
    this.pos = pos;
    this.id = Destination.getId(pos);
  }

  static getId(pos: RoomPosition): string {
    return `${ pos.roomName }#${ pos.x },${ pos.y }`;
  }
}

export class Delivery extends Destination implements IDelivery {
  readonly targetId?: Id<AnyCreep> | Id<Structure>;
  readonly target?: AnyCreep | Structure;
  readonly amount?: number;

  readonly resource: ResourceConstant;
  readonly dumpRange: number;

  constructor(args: TryDeliverOptions) {
    super(args.pos ?? new RoomPosition(args.target!.pos.x, args.target!.pos.y, args.target!.pos.roomName));

    this.target = args.target;
    this.targetId = args.targetId;
    this.resource = args.resource ?? RESOURCE_ENERGY;
    this.dumpRange = args.dumpRange ?? 5;
    this.amount = args.amount;
  }
}

export class Collection extends Destination implements ICollection {
  readonly targetId?: Id<Structure> | Id<Tombstone> | Id<Ruin> | Id<Resource>;
  readonly target?: Structure | Tombstone | Ruin | Resource;
  readonly amount?: number;

  readonly resource: ResourceConstant;
  readonly scavengeRange: number;

  constructor(args: TryCollectOptions) {
    super(args.pos ?? new RoomPosition(args.target!.pos.x, args.target!.pos.y, args.target!.pos.roomName));

    this.target = args.target;
    this.targetId = args.targetId;
    this.resource = args.resource ?? RESOURCE_ENERGY;
    this.scavengeRange = args.scavengeRange ?? 5;
  }
}

export class LogisticsManager implements ILogisticsManager {

  private readonly _collectionSpots: { [id: string]: Delivery } = {};
  private readonly _haulerDestinationAllocations: { [haulerName: string]: Delivery } = {};
  private readonly _destinationHaulerAllocations: { [destinationId: string]: string[] } = {};

  constructor(
    private room: Room
  ) {
  }

  private allocateHauler(hauler: HaulerCreep, destination: Delivery) {
    this._haulerDestinationAllocations[hauler.name] = destination;
    this._destinationHaulerAllocations[destination.id] ??= [];
    this._destinationHaulerAllocations[destination.id].push(hauler.name);

    return destination;
  }

  private getCollectionPointDestination(hauler: HaulerCreep) {
    const unallocatedDestinations = Object.values(this._collectionSpots).filter(x => !this._destinationHaulerAllocations[x.id]);
    if (!unallocatedDestinations.length) return undefined;
    const path = PathFinder.search(hauler.pos, unallocatedDestinations.map(x => x.pos)).path;
    const destination = path[path.length - 1];
    return unallocatedDestinations.find(x => Destination.getId(x.pos) === Destination.getId(destination));
  }

  private getExtensionDestination(hauler: HaulerCreep) {
    const room = Game.rooms[hauler.memory.room];
    if (!room) return undefined;

    // Get all the extensions that have free energy.
    const extensions = room.owned?.state.structureState.getExtensions().filter(x => !!x.store.getFreeCapacity());
    if (!extensions?.length) return undefined;



    this._sourceDistanceFromSource[source.id] = !!spawn
      ? PathFinder.search(spawn.pos, { pos: source.pos, range: 1 }).cost
      : 99;

    // Todo: Hauler has 150 energy. Hauler can fill three extensions. Don't send 3 haulers, but rather check delivery destinations.

    const path = PathFinder.search(hauler.pos, extensions.map(x => x.pos)).path;
    const destination = path[path.length - 1];
    const closestExtension = extensions.find(x => Destination.getId(x.pos) === Destination.getId(destination));
    return new Delivery({ target: closestExtension });
  }

  private getSpawnDestination(hauler: HaulerCreep): Delivery | undefined {
    const spawn = Game.rooms[hauler.memory.room]?.owned?.state.spawn;
    if (!spawn) return undefined;

    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && !spawn.hasSpawnRequests) return undefined;

    const energyAvailable = spawn.room.energyAvailable;
    const energyNeeded = spawn.room.energyCapacityAvailable * (Math.abs(Number(spawn.hasSpawnRequests) - 2));

    const allocatedHaulerNames = this._destinationHaulerAllocations[Destination.getId(spawn.pos)] ?? [];
    if (!allocatedHaulerNames.length) return new Delivery({ target: spawn });

    const haulers = allocatedHaulerNames.map(x => Game.creeps[x]) as HaulerCreep[];
    const allocatedHaulerCargo = haulers.reduce((p, c) => p + c.store.getUsedCapacity(RESOURCE_ENERGY), 0);

    if ((energyAvailable + allocatedHaulerCargo) >= energyNeeded) return undefined;

    return new Delivery({ target: spawn });
  }

  clearCollectionSpot(id: string): void {
    delete this._collectionSpots[id];
  }

  getCollectionDestination(hauler: HaulerCreep): Collection | undefined {

    return undefined;
  }

  getDeliveryDestination(hauler: HaulerCreep): Delivery | undefined {
    const haulerDestination = this._haulerDestinationAllocations[hauler.name];
    if (!!haulerDestination) return haulerDestination;

    const spawn = this.getSpawnDestination(hauler);
    if (spawn) return this.allocateHauler(hauler, spawn);

    const extension = this.getExtensionDestination(hauler);
    if (extension) return this.allocateHauler(hauler, extension);

    const collectionPoint = this.getCollectionPointDestination(hauler);
    if (collectionPoint) return this.allocateHauler(hauler, collectionPoint);

    return undefined;
  }

  requestCollectionSpot(...args: any[]): Delivery {
    // Take all the args into account, and generate a collection spot.
    const collectionSpot = new CollectionSpot(new RoomPosition(0, 0, this.room.name));
    this._collectionSpots[collectionSpot.id] = collectionSpot;
    return collectionSpot;
  }
}