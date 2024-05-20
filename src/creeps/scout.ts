import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { Scout } from "../units-of-work/scout";

export function isScoutMemory(memory: CreepMemory): memory is ScoutMemory {
  return memory.role === CreepTypes.scout;
}

export interface ScoutMemory extends CreepMemory {
  role: "scout";
  target: RoomPosition | undefined;
  roomNames: string[];
}

class ScoutCreep extends BaseCreep {
  private readonly _scout = new Scout({
    getPosition: (creep: Creep) => (creep.memory as ScoutMemory).target,
    getNewPosition: (creep: Creep) => {
      const newRoom = (creep.memory as ScoutMemory).roomNames.shift();
      if (!newRoom) return;
      return new RoomPosition(25, 25, newRoom);
    }
  });

  override readonly role = CreepTypes.scout;
  override readonly bodyParts: BodyPartConstant[] = [ MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ];

  need(budget: number, memory: Partial<ScoutMemory>) {
    return { creepType: CreepTypes.scout, budget, memory };
  }

  run(creep: Creep): void {
    this._scout.run(creep);
  }
}

export const scoutCreep = new ScoutCreep();
