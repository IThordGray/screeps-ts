import { EventTypes } from "../abstractions/event-types";
import { eventBus } from "./eventBus";

class MemoryManager {
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