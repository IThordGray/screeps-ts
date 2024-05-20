import { CreepType, CreepTypes } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { DroneMemory, genericDroneCreep } from "creeps/drone";
import { haulerCreep, HaulerMemory } from "creeps/hauler";
import { ldHarvesterCreep, LDHMemory } from "creeps/ldh";
import { minerCreep, MinerMemory } from "creeps/miner";
import { scoutCreep, ScoutMemory } from "creeps/scout";
import { harvesterCreep } from "../creeps/harvester";
import { Task } from "../tasking/task";
import { eventBus } from "./event-bus";
import { RoomState } from "./game-state";
import { StratManager } from "./strat-manager";

export class Spawner {
  get spawn() {
    return RoomState.get(this._roomName).spawn;
  }

  get spawning() {
    return this.spawn.spawning;
  }

  get spawningCreepName(): string | undefined {
    return Memory.rooms[this._roomName]?.spawningCreep;
  }

  set spawningCreepName(name: string | undefined) {
    Memory.rooms[this._roomName] ??= { } as RoomMemory;
    Memory.rooms[this._roomName].spawningCreep = name;
  }

  constructor(
    private readonly _roomName: string,
    private readonly _stratManager: StratManager
  ) { }

  private spawnCreep(creepType: CreepType, budget: number, memory: Record<string, any> = {}) {
    const spawnMap: Record<CreepType, () => void> = {
      miner: () => this.spawnMiner(budget, memory),
      hauler: () => this.spawnHauler(budget, memory),
      scout: () => this.spawnScout(budget, memory),
      ldh: () => this.spawnLdHarvester(budget, memory),
      drone: () => this.spawnDrone(budget, memory),
      harvester: () => this.spawnHarvester(budget)
    };

    spawnMap[creepType]();
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

  run() {
    const creepNeeds = this._stratManager.getCurrentStrat().getCreepRequirements();
    const creepToBuild = creepNeeds.shift();
    if (!creepToBuild) return;

    this.spawnCreep(creepToBuild.creepType, creepToBuild.budget, creepToBuild.memory);
  }

  spawnHarvester(budget: number) {
    if (this.spawning) return;
    const memory: any = { role: CreepTypes.harvester, room: this._roomName };
    const name = harvesterCreep.getName();
    this.spawn.spawnCreep(harvesterCreep.getBody(budget), name, { memory });
  }

  spawnDrone(budget: number, m: Partial<DroneMemory> = {}) {
    if (this.spawning) return;
    const memory: any = { role: CreepTypes.genericDrone, room: this._roomName, ...m };
    const name = genericDroneCreep.getName();
    this.spawn.spawnCreep(genericDroneCreep.getBody(budget), name, { memory });
  }

  spawnHauler(budget: number, m: Partial<HaulerMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.hauler, room: this._roomName, ...m };
    const name = haulerCreep.getName();
    this.spawn.spawnCreep(haulerCreep.getBody(budget), name, { memory });
  }

  spawnLdHarvester(budget: number, m: Partial<LDHMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.ldh, room: this._roomName, ...m };
    const name = ldHarvesterCreep.getName();
    this.spawn.spawnCreep(ldHarvesterCreep.getBody(budget), name, { memory });
  }

  spawnMiner(budget: number, m: Partial<MinerMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.miner, room: this._roomName, ...m };
    const name = minerCreep.getName();
    this.spawn.spawnCreep(minerCreep.getBody(budget), name, { memory });
  }

  spawnScout(budget: number, m: Partial<ScoutMemory> = {}) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.scout, room: this._roomName, ...m };
    const name = scoutCreep.getName();
    this.spawn.spawnCreep(scoutCreep.getBody(budget), name, { memory });
  }

}
