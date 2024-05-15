import { CreepType } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { Logger } from "helpers/logger";
import { OnRun } from "../abstractions/interfaces";
import { eventBus } from "./event-bus";

export class ScoutedRoomState {
  controllerIds: string[] = [];
  sourceIds: string[] = [];
}

export class CreepState {
  // References to all the creeps of the role.
  creeps: Creep[] = [];

  // Number of creeps
  get count() {
    return this.creeps.length;
  }
}

class GameState implements OnRun {

  private readonly _onCreepSpawn = (creep: Creep) => Logger.success(`Creep spawned: ${ creep.name }`);
  private readonly _onCreepDeath = (creep: Creep) => Logger.warn(`Creep died: ${ creep.name }`);

  creeps: { [creepName: string]: CreepState } = {};

  get homeSpawn() {
    return Game.spawns["Spawn1"];
  }

  get sources(): { [sourceId: string]: Source; } {
    return Memory.sources;
  }

  get controllers(): { [controllerId: string]: StructureController; } {
    return Memory.controllers;
  }

  get scoutedRooms(): { [roomName: string]: ScoutedRoomState } {
    return Memory.scoutedRooms;
  }

  constructor() {
    Memory.sources ??= {};
    Memory.controllers ??= {};
    Memory.scoutedRooms ??= {};

    eventBus.on(EventTypes.creepSpawned, this._onCreepSpawn.bind(this));
    eventBus.on(EventTypes.creepDied, this._onCreepDeath.bind(this));
  }

  getCreepCount(role: CreepType) {
    return this.creeps[role]?.count ?? 0;
  }

  getCreepState(role: CreepType) {
    return this.creeps[role] ?? new CreepState();
  }

  run() {
    this.creeps = {};

    _.forEach(Game.creeps, creep => {
      const creepRole = creep.memory.role;
      this.creeps[creepRole] ??= new CreepState();
      this.creeps[creepRole].creeps.push(creep);
    });
  }

}

export const gameState = new GameState();
