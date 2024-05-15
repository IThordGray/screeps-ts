import { EventTypes } from "abstractions/event-types";
import { Logger } from "helpers/logger";
import { eventBus } from "singletons/event-bus";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { taskDistributor } from "singletons/task-distributor";
import { ErrorMapper } from "utils/ErrorMapper";
import { memoryManager } from "./managers/memory.manager";
import { creepManager } from "./singletons/creep-manager";
import { strategyManager } from "./singletons/strat-manager";

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

    sources: { [sourceId: string]: Source };
    controllers: { [controllerName: string]: StructureController };
    scoutedRooms: { [roomName: string]: { controllerIds: string[]; sourceIds: string[] } };
  }

  interface CreepMemory {
    role: string;
    working: boolean;
    state?: string;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

export const update = () => {
  spawner.update();
  strategyManager.update();
  taskDistributor.update();
};

export const run = () => {
  spawner.run();
  strategyManager.run();
  taskDistributor.run();
  creepManager.run();
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  Logger.log(`Current game tick is ${ Game.time }`);

  gameState.run();

  update();
  run();

  memoryManager.run();
});
