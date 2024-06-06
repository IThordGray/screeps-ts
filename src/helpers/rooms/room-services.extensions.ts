import { BuildPlanner } from "../../singletons/buildPlanner";
import { ConstructionManager } from "../../singletons/constructionManager";
import { CreepManager } from "../../singletons/creepManager";
import { gameState } from "../../singletons/gameState";
import { Spawner } from "../../singletons/spawner";
import { StratManager } from "../../singletons/stratManager";
import { RoomState } from "../../states/roomState";
import { TaskAllocator } from "../../tasking/taskAllocator";
import { TaskDistributor } from "../../tasking/taskDistributor";
import { Type } from "../type";

const groupByRoom: { [room: string]: { [type: string]: any } } = {};

// problem is room ref changes all the time
const inject = <T>(room: Room, type: Type<T>) => {
  groupByRoom[room.name] ??= {};
  const roomServices = groupByRoom[room.name];
  roomServices[type.name] ??= new type(room);
  roomServices[type.name]._room = room;
  return roomServices[type.name];
}

const getRoomState = (roomName: string) => {
  gameState.roomStates[roomName] ??= new RoomState(roomName);
  return gameState.roomStates[roomName];
}

Object.defineProperty(Room.prototype, 'owned', {
  get: function() {
    if (!this.controller?.my) return undefined;

    const room = this;
    return Object.defineProperties({ }, {
      state: { get() { return getRoomState(room.name) }},
      buildPlanner: { get() { return inject(room, BuildPlanner) } },
      constructionManager: { get() { return inject(room, ConstructionManager) } },
      taskAllocator: { get() { return inject(room, TaskAllocator) } },
      stratManager: { get() { return inject(room, StratManager) } },
      spawner: { get() { return inject(room, Spawner) } },
      taskDistributor: { get() { return inject(room, TaskDistributor) } },
      creepManager: { get() { return inject(room, CreepManager) } }
    })
  }
})

