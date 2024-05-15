import { EventTypes } from "../abstractions/event-types";
import { OnRun } from "../abstractions/interfaces";
import { eventBus } from "../singletons/event-bus";

class MemoryManager implements OnRun {
  run(): void {
    for (const name in Memory.creeps) {
      if (name in Game.creeps) continue;

      const creep = Memory.creeps[name];
      eventBus.emit(EventTypes.creepDied, { ...creep, name });
      delete Memory.creeps[name];
    }
  }
}

export const memoryManager = new MemoryManager();