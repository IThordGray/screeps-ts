import { EventTypes } from "abstractions/event-types";
import { Logger } from "helpers/logger";
import { delegator } from "singletons/delegator.class";
import { eventBus } from "singletons/event-bus";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { taskDistributor } from "singletons/task-distributor";
import { ErrorMapper } from "utils/ErrorMapper";

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
    scoutedRooms: { [roomName: string]: { controllerIds: string[]; sourceIds: string[] } }
  }

  interface CreepMemory {
    role: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  Logger.log(`Current game tick is ${Game.time}`);

  gameState.update();
  spawner.update();
  delegator.update();

  // Figure out which creeps should which tasks.
  taskDistributor.update();

  // Distribute high priority tasks before delegating general work.
  taskDistributor.run();

  // Delegate general tasks.
  delegator.run();

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      const creep = Memory.creeps[name];
      eventBus.emit(EventTypes.creepDied, { ...creep, name });

      delete Memory.creeps[name];
    }
  }
});
