import { CreepType } from "abstractions/creep-types";

export class ScoutedRoomState {
  controllerIds: string[] = [];
  sourceIds: string[] = [];
}

export class CreepState {
  // References to all the creeps of the role.
  refs: Creep[] = [];

  // Number of creeps
  get count() {
    return this.refs.length;
  }
}

class GameState {
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
  }

  getCreepCount(role: CreepType) {
    return this.creeps[role]?.count ?? 0;
  }

  update() {
    this.creeps = {};

    _.forEach(Game.creeps, creep => {
      const creepRole = creep.memory.role;
      this.creeps[creepRole] ??= new CreepState();
      this.creeps[creepRole].refs.push(creep);
    });
  }

}

export const gameState = new GameState();
