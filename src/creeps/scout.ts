import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { ScoutedRoomState, gameState } from "singletons/game-state";

export function isScoutMemory(memory: CreepMemory): memory is ScoutMemory {
    return memory.role === CreepTypes.scout;
}

export interface ScoutMemory extends CreepMemory {
    role: 'scout';
    target: string | undefined;
    roomIds: string[];
}

class ScoutCreep extends BaseCreep {
    override role = CreepTypes.scout;
    override bodyParts: BodyPartConstant[] = [MOVE, MOVE, MOVE];

    private goToRecycle(creep: Creep) { }

    private moveToTargetRoom(creep: Creep) {
        if (!isScoutMemory(creep.memory) || !creep.memory.target) return;
        const code = creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: "#ffffff" } });
        if (code === ERR_NO_PATH) throw new Error('No path found!');
    }

    private scoutCurrentRoom(creep: Creep) {
        if (!isScoutMemory(creep.memory)) return;
        if (gameState.scoutedRooms[creep.room.name]) return;

        gameState.scoutedRooms[creep.room.name] ??= new ScoutedRoomState();

        const sources = creep.room.find(FIND_SOURCES);
        sources.forEach(source => {
            Memory.sources ??= {};
            Memory.sources[source.id] = source;

            const sourceIds = Array.from(new Set(gameState.scoutedRooms[creep.room.name].sourceIds).add(source.id))
            gameState.scoutedRooms[creep.room.name].sourceIds = sourceIds;
            gameState.sources[source.id] = source;
        });

        const controller = creep.room.controller;
        if (controller) {
            const controllerIds = Array.from(new Set(gameState.scoutedRooms[creep.room.name].controllerIds).add(controller.id));
            gameState.scoutedRooms[creep.room.name].controllerIds = controllerIds;
            gameState.controllers[controller.id] = controller;
        }

    }

    run(creep: Creep): void {
        if (!isScoutMemory(creep.memory)) return;

        // If I don't have a target room, try to get a new room from my list of room ids
        creep.memory.target ??= creep.memory.roomIds.shift();
        // If I don't gave a target room still, go to spawn and recycle
        if (!creep.memory.target) return this.goToRecycle(creep);

        // Scout the current room regardless if you reached your destination.
        this.scoutCurrentRoom(creep);

        // Now that I have a target room; Am I currently in the target room?

        if (creep.memory.target === creep.room.name) {
            creep.memory.target = undefined;
            return;
        }

        this.moveToTargetRoom(creep);
    }

}

export const scoutScreep = new ScoutCreep();
