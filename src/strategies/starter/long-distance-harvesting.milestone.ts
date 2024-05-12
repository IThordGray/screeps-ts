import { CreepTypes } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { Milestone } from "classes/milestone";
import { isLDHMemory } from "creeps/long-distance-harvester";
import { eventBus } from "singletons/event-bus";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";

export class LongDistanceHarvestingMilestone extends Milestone {

    private readonly _ldhsPerSource = 3;

    // CreepName => SourceId
    private _creepSourceAllocationMap: { [creepName: string]: string } = {};

    // SourceId => Set(CreepId)
    private _sourceCreepAllocationMap: { [sourceName: string]: Set<string> } = {}

    private onCreepSpawn = (name: string) => {
        const creep = Game.creeps[name];

        if (isLDHMemory(creep.memory)) {
            const source = new Source(creep.memory.target);

            this._creepSourceAllocationMap[name] = source.id;
            this._sourceCreepAllocationMap[source.id] ??= new Set();
            this._sourceCreepAllocationMap[source.id].add(name);
        }
    }

    private onCreepDeath = (memory: CreepMemory & { name: string }) => {
        if (!isLDHMemory(memory)) return;
        delete this._creepSourceAllocationMap[memory.name];
        this._sourceCreepAllocationMap[memory.target]?.delete(memory.name);

        if (!this._sourceCreepAllocationMap[memory.target]?.size) {
            delete this._sourceCreepAllocationMap[memory.target];
        }
    };

    private _adjacentSources: Source[] = [];

    constructor() {
        super();

        // Set viable adjacent sources.
        this.initAdjacentSources();

        // Allocate existing LDHs to the respective sources.
        this.initLDHarversterAllocations();

        eventBus.on(EventTypes.creepDied, this.onCreepDeath.bind(this));
        eventBus.on(EventTypes.creepSpawned, this.onCreepSpawn.bind(this));
    }

    private initAdjacentSources() {
        this._adjacentSources = [];
        Array.from(Object.values(gameState.sources)).forEach(s => {
            const room = s.room;
            // Is this an adjacent room?
            if (room.name === gameState.homeSpawn.room.name) return;

            // Is the room controlled by another player?
            if (!!room.controller?.owner || !!room.controller?.reservation) return;

            this._adjacentSources.push(s);
        });

        this._adjacentSources.sort((a, b) => {
            const rangeA = gameState.homeSpawn.pos.getRangeTo(a);
            const rangeB = gameState.homeSpawn.pos.getRangeTo(b);
            return rangeA - rangeB;
        });
    }

    private initLDHarversterAllocations() {
        const { refs: ldhs } = gameState.creeps[CreepTypes.ldh] ?? {};
        ldhs?.forEach(x => {
            if (!isLDHMemory(x.memory)) return;
            const { target } = x.memory;
            if (!target) return;

            this._creepSourceAllocationMap[x.name] = target;
            this._sourceCreepAllocationMap[target] ??= new Set();
            this._sourceCreepAllocationMap[target].add(x.name);
        });
    }

    private spawnHarvester(cost: number) {
        const source = this._adjacentSources.find(x => (this._sourceCreepAllocationMap[x.id]?.size ?? 0) < this._ldhsPerSource);
        if (!source) return;

        spawner.spawnLdHarvester(cost, source.id);
    }

    condition(...args: any[]): boolean {
        const ldHarvesters = gameState.getCreepCount(CreepTypes.ldh);
        if ((this._adjacentSources.length * this._ldhsPerSource) > ldHarvesters) return false;

        return true;
    }

    run(...args: any[]): void {
        if (spawner.spawning) return;

        const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;

        const ldHarvesters = gameState.getCreepCount(CreepTypes.ldh);
        if ((this._adjacentSources.length * this._ldhsPerSource) > ldHarvesters) {
            return this.spawnHarvester(availableEnergy);
        }
    }
}
