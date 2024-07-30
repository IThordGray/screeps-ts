import { EventTypes } from "../abstractions/EventTypes";
import { eventBus } from "../singletons/EventBus";

export class Spawner implements ISpawner {
  private get _stratManager() {
    return this._room.owned.stratManager;
  }

  get spawn(): StructureSpawn {
    return this._room.owned.state.spawn!;
  }

  get spawning() {
    return this.spawn.spawning;
  }

  get spawningCreepName(): string | undefined {
    return Memory.rooms[this._room.name]?.spawningCreep;
  }

  set spawningCreepName(name: string | undefined) {
    Memory.rooms[this._room.name] ??= {} as RoomMemory;
    Memory.rooms[this._room.name].spawningCreep = name;
  }

  constructor(
    private readonly _room: Room
  ) {
  }

  private spawnCreep(creepType: CreepType, budget: number, memory: Record<string, any> = {}) {
    const spawnMap: Record<CreepType, () => void> = {
      miner: () => this.spawnMiner(budget, memory),
      hauler: () => this.spawnHauler(budget, memory),
      scout: () => this.spawnScout(budget, memory),
      genericDrone: () => this.spawnGenericDrone(budget, memory)
    };

    spawnMap[creepType]();
  }

  run() {
    const [ creepToBuild ] = this._stratManager.getCurrentStrat().creepNeeds;
    if (!creepToBuild) return;

    this.spawnCreep(creepToBuild.creepType, creepToBuild.budget, creepToBuild.memory);
  }

  spawnGenericDrone(budget: number, m: Partial<GenericDroneMemory> = {}) {
    this.spawn.spawnGenericDrone(budget, { room: this._room.name, ...m } as any);
  }

  spawnHauler(budget: number, m: Partial<HaulerMemory> = {}) {
    this.spawn.spawnHauler(budget, { room: this._room.name, ...m } as any);
  }

  spawnMiner(budget: number, m: Partial<MinerMemory> = {}) {
    this.spawn.spawnMiner(budget, { room: this._room.name, ...m } as any);
  }

  spawnScout(budget: number, m: Partial<ScoutMemory> = {}) {
    this.spawn.spawnScout(budget, { room: this._room.name, ...m } as any);
  }

  update() {
    if (this.spawning) this.spawningCreepName = this.spawning.name;

    if (!this.spawning && this.spawningCreepName) {
      const creep = Game.creeps[this.spawningCreepName];
      if (!creep) return;

      eventBus.emit(EventTypes.creepSpawned, creep);
      this.spawningCreepName = undefined;
    }
  }

}
