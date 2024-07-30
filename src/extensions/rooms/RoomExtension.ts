import { Type } from "../../helpers/type";
import { ConstructionManager } from "../../services/ConstructionManager";
import { CreepManager } from "../../services/CreepManager";
import { Dashboard } from "../../services/Dashboard";
import { Spawner } from "../../services/Spawner";
import { StratManager } from "../../services/StratManager";
import { gameState } from "../../states/GameState";
import { RoomState } from "../../states/RoomState";
import { TaskDistributor } from "../../services/TaskDistributor";

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
      constructionManager: { get() { return inject(room, ConstructionManager) } },
      stratManager: { get() { return inject(room, StratManager) } },
      spawner: { get() { return inject(room, Spawner) } },
      taskDistributor: { get() { return inject(room, TaskDistributor) } },
      creepManager: { get() { return inject(room, CreepManager) } },
      dashboard: { get() { return inject(room, Dashboard )} }
    })
  }
})

