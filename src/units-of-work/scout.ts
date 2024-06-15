import { ScoutMemory } from "../creeps/scout";
import { ScoutedRoomState } from "../states/gameState";

export interface IMemoryCanScout {
  pos: RoomPosition;
  roomNames: string[];
}

type ScoutArgs = {
  getPosition: (creep: Creep) => RoomPosition | undefined,
  getNewPosition: (creep: Creep) => RoomPosition | undefined,
};

export class Scout {
  static state = "scouting";
  static action = (creep: Creep) => creep.say("scouting");

  private readonly _getPosition: ScoutArgs["getPosition"];
  private readonly _getNewPosition: ScoutArgs["getNewPosition"];

  constructor(args: ScoutArgs) {
    this._getPosition = args.getPosition;
    this._getNewPosition = args.getNewPosition;
  }

  private scoutCurrentRoom(creep: Creep) {
    if (Memory.scoutedRooms[creep.room.name]) return;

    Memory.scoutedRooms[creep.room.name] ??= new ScoutedRoomState();

    const sources = creep.room.find(FIND_SOURCES);
    sources.forEach(source => {
      Memory.sources ??= {};
      Memory.sources[source.id] = source.pos;

      const sourceIds = Array.from(new Set(Memory.scoutedRooms[creep.room.name].sourceIds).add(source.id));
      Memory.scoutedRooms[creep.room.name].sourceIds = sourceIds;
    });

    const controller = creep.room.controller;
    if (controller) {
      const controllerId = controller.id;
      Memory.scoutedRooms[creep.room.name].controllerId = controllerId;
      Memory.controllers[controller.id] = controller.pos;
    }
  }

  run(creep: Creep) {
    this.scoutCurrentRoom(creep);

    const pos = this._getPosition(creep);
    if (!pos) return;

    if (creep.room.name !== pos.roomName) {
      creep.moveTo(pos);
    } else {
      (creep.memory as ScoutMemory).target = this._getNewPosition(creep);
    }

  }
}