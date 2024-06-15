import { CreepTypes } from "../abstractions/creep-types";
import { EventTypes } from "../abstractions/eventTypes";
import { DroneMemory, genericDroneCreep } from "../creeps/generic-drone";
import { haulerCreep, HaulerMemory } from "../creeps/hauler";
import { minerCreep, MinerMemory } from "../creeps/miner";
import { scoutCreep, ScoutMemory } from "../creeps/scout";
import { eventBus } from "./eventBus";

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
      drone: () => this.spawnDrone(budget, memory)
    };

    spawnMap[creepType]();
  }

  run() {
    const [ creepToBuild ] = this._stratManager.getCurrentStrat().creepNeeds;
    if (!creepToBuild) return;

    this.spawnCreep(creepToBuild.creepType, creepToBuild.budget, creepToBuild.memory);
  }

  spawnDrone(budget: number, m: Partial<DroneMemory> = {}) {
    if (this.spawning) return;
    const memory: any = { role: CreepTypes.genericDrone, room: this._room.name, ...m };
    const name = genericDroneCreep.getName();
    this.spawn.spawnCreep(genericDroneCreep.getBody(budget), name, { memory });
  }

  spawnHauler(budget: number, m: Partial<HaulerMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.hauler, room: this._room.name, ...m };
    const name = haulerCreep.getName();
    this.spawn.spawnCreep(haulerCreep.getBody(budget), name, { memory });
  }

  spawnMiner(budget: number, m: Partial<MinerMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.miner, room: this._room.name, ...m };
    const name = minerCreep.getName();
    this.spawn.spawnCreep(minerCreep.getBody(budget), name, { memory });
  }

  spawnScout(budget: number, m: Partial<ScoutMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.scout, room: this._room.name, ...m };
    const name = scoutCreep.getName();
    this.spawn.spawnCreep(scoutCreep.getBody(budget), name, { memory });
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
