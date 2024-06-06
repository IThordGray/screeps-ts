import 'reflect-metadata';

import { VisualUtils } from "./helpers/visualUtils";
import { gameState } from "./singletons/gameState";
import { memoryManager } from "./singletons/memory.manager";
import { roomManager } from "./singletons/roomManager";
import { ErrorMapper } from "./utils/ErrorMapper";

import "./helpers/creeps";
import "./helpers/rooms/room-services.extensions";
// import "./helpers/spawns/spawn-miner.extensions";

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
    role: string;
    state?: string;
  }

  interface RoomMemory {
    name?: string;
    controllerLevel?: number;
    controllerId?: string;
    spawningCreep?: string;
    stratManager?: {
      currentMilestone?: string;
    };
  }

  // Syntax for adding properties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

function unwrappedLoop() {
  gameState.update();

  _.forEach(Game.rooms, room => {
    if (!room.controller?.my) return;

    roomManager.run(room);

    // const minerCount = room.creepManager.minerCount();
    // console.log(room.creepManager.minerCount());
    // const headers = [ "Unit", "Count" ];
    // const rows = [
    //   [ "Miners", room.state.creeps.miners.length ],
    //   [ "Haulers", room.state.creeps.haulers.length ],
    //   [ "Builders", room.state.creeps.builders.length ],
    //   [ "Upgraders", room.state.creeps.upgraders.length ]
    // ];

    // VisualUtils.createTable("sim", 0, 0, 5, 1, headers, rows);

  });

  memoryManager.run();
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
const loop = ErrorMapper.wrapLoop(unwrappedLoop);

export { loop, unwrappedLoop };