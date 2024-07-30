import { EventTypes } from "../abstractions/EventTypes";
import { eventBus } from "./EventBus";

class MemoryManager {
  private readonly _memory: Memory | undefined;

  constructor() {
    this._memory = Memory;
  }

  override(): void {
    delete (global as any).Memory;
    (global as any).Memory = this._memory;
  }

  cleanUp(): void {
    for (const name in Memory.creeps) {
      if (name in Game.creeps) continue;

      const creep = Memory.creeps[name];
      eventBus.emit(EventTypes.creepDied, { ...creep, name });
      delete Memory.creeps[name];
    }
  }

  restore() {
    (RawMemory as any)._parsed = Memory;
  }
}

export const memoryManager = new MemoryManager();