import "reflect-metadata";
import { eventHub } from "./eventHub";
import { roomManager } from "./services/RoomManager";
import { memoryManager } from "./singletons/MemoryManager";
import { gameState } from "./states/GameState";
import { ErrorMapper } from "./utils/ErrorMapper";

import "./extensions";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */


  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;

    sources: { [sourceId: string]: RoomPosition };
    controllers: { [controllerId: string]: RoomPosition };
    scoutedRooms: { [roomName: string]: { controllerId?: Id<StructureController>; sourceIds: Id<Source>[] } };
  }

  interface CreepMemory {
    room: string;
    type: string;
    state?: string;
  }

  interface RoomMemory {
    name?: string;
    controllerLevel?: number;
    controllerId?: string;
    spawningCreep?: string;
    stratManager?: Record<string, any>;
  }

  // Syntax for adding properties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

function unwrappedLoop() {
  memoryManager.override();
  memoryManager.cleanUp();

  gameState.update();

  _.forEach(Game.rooms, room => {
    if (!room.controller?.my) return;
    roomManager.run(room);
  });

  memoryManager.restore();
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
eventHub.register();
const loop = ErrorMapper.wrapLoop(unwrappedLoop);

export { loop, unwrappedLoop };
