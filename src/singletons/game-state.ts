import { EventTypes } from "abstractions/event-types";
import { Logger } from "helpers/logger";
import { CreepType } from "../abstractions/creep-types";
import { eventBus } from "./event-bus";

export class ScoutedRoomState {
  controllerId: Id<StructureController> | undefined;
  sourceIds: Id<Source>[] = [];
}

export class RoomState {

  static get = (roomName: string) => {
    gameState.roomStates[roomName] ??= new RoomState(roomName);
    return gameState.roomStates[roomName];
  };

  private _sources!: { source: Source, distance: number }[];
  readonly spawn: StructureSpawn;

  creepTypes: { [creepType: string]: Creep[] } = {};
  droneTypes: { [droneType: string]: Creep[] } = {};

  get room() {
    return Game.rooms[this._roomName];
  }

  constructor(
    private readonly _roomName: string
  ) {
    this.spawn = Game.rooms[this._roomName].find(FIND_MY_SPAWNS)![0];
  }

  getCreepCount(creepType: CreepType) {
    this.creepTypes[creepType] ??= [];
    return this.creepTypes[creepType].length;
  }

  getCreepState(creepType: CreepType) {
    this.creepTypes[creepType] ??= [];
    return this.creepTypes[creepType];
  }

  getSources() {
    if (!!this._sources) return this._sources;

    const sources = this.spawn.room.find(FIND_SOURCES);

    // Calculate the distance from the spawn to each source
    const sourcesWithDistance = sources.map(source => {
      const path = PathFinder.search(this.spawn.pos, { pos: source.pos, range: 1 });
      return { source: source, distance: path.cost };
    });

    sourcesWithDistance.sort((a, b) => a.distance - b.distance);

    this._sources = sourcesWithDistance;
    return this._sources;
  }
}

class GameState {

  private readonly _onCreepSpawn = (creep: Creep) => Logger.success(`Creep spawned: ${ creep.name }`);
  private readonly _onCreepDeath = (creep: Creep) => Logger.warn(`Creep died: ${ creep.name }`);

  roomStates: { [roomName: string]: RoomState } = {};

  constructor() {
    eventBus.on(EventTypes.creepSpawned, this._onCreepSpawn.bind(this));
    eventBus.on(EventTypes.creepDied, this._onCreepDeath.bind(this));
  }

  update() {
    this.roomStates = {};

    _.forEach(Game.creeps, creep => {
      const room = creep.memory.room;
      const role = creep.memory.role;

      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].creepTypes[role] ??= [];
      this.roomStates[room].creepTypes[role].push(creep);
    });
  }
}

export const gameState = new GameState();
