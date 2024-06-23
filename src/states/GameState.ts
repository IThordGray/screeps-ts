import { RoomState } from "./RoomState";

export class ScoutedRoomState {
  controllerId: Id<StructureController> | undefined;
  sourceIds: Id<Source>[] = [];
}

class GameState {
  roomStates: { [roomName: string]: RoomState } = {};

  update() {
    this.roomStates = {};

    _.forEach(Game.creeps, creep => {
      const room = creep.memory.room;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].creepState.add(creep);
      this.roomStates[room].taskState.allocate(creep);
    });

    _.forEach(Game.structures, structure => {
      const room = structure.room.name;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].structureState.add(structure);
    });

    _.forEach(Game.constructionSites, constructionSite => {
      const room = constructionSite.room?.name;
      if (!room) return;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].constructionState.add(constructionSite);
    });
  }
}

export const gameState = new GameState();
