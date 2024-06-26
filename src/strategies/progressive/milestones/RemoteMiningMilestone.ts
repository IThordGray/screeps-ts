// import { CreepTypes } from "abstractions/creep-types";
// import { isLDHMemory } from "creeps/ldh";
// import { gameState } from "singletons/game-state";
// import { spawner } from "singletons/spawner";
// import { IMilestone } from "../milestone.interface";
//
// export class LdhMilestone implements IMilestone {
//
//   private readonly _ldhsPerSource = 3;
//
//   // CreepName => SourceId
//   private _creepSourceAllocationMap: { [creepName: string]: string } = {};
//
//   // SourceId => Set(CreepId)
//   private _sourceCreepAllocationMap: { [sourceName: string]: Set<string> } = {};
//
//   private _adjacentSources: Source[] = [];
//
//   private initAdjacentSources() {
//     this._adjacentSources = [];
//     Array.from(Object.values(gameState.sources)).forEach(s => {
//       const room = s.room;
//       // Is this an adjacent room?
//       if (room.name === gameState.homeSpawn.room.name) return;
//
//       // Is the room controlled by another player?
//       if (!!room.controller?.owner || !!room.controller?.reservation) return;
//
//       this._adjacentSources.push(s);
//     });
//
//     this._adjacentSources.sort((a, b) => {
//       const rangeA = gameState.homeSpawn.pos.getRangeTo(a);
//       const rangeB = gameState.homeSpawn.pos.getRangeTo(b);
//       return rangeA - rangeB;
//     });
//   }
//
//   private initLDHarvesterAllocations() {
//     const { creeps: ldhs } = gameState.creeps[CreepTypes.ldh] ?? {};
//     ldhs?.forEach(x => {
//       if (!isLDHMemory(x.memory)) return;
//       const { target } = x.memory;
//       if (!target) return;
//
//       this._creepSourceAllocationMap[x.name] = target;
//       this._sourceCreepAllocationMap[target] ??= new Set();
//       this._sourceCreepAllocationMap[target].add(x.name);
//     });
//   }
//
//   private spawnHarvester(cost: number) {
//     const source = this._adjacentSources.find(source => {
//       const sourceAllocation = this._sourceCreepAllocationMap[source.id];
//       return (sourceAllocation?.size ?? 0) < this._ldhsPerSource;
//     });
//     if (!source) return;
//
//     spawner.spawnLdHarvester(cost, source.id);
//   }
//
//   condition(...args: any[]): boolean {
//     const ldHarvesters = gameState.getCreepCount(CreepTypes.ldh);
//     if ((this._adjacentSources.length * this._ldhsPerSource) > ldHarvesters) return false;
//
//     return true;
//   }
//
//   init() {
//     // Todo: This is wrong as an init.. as the scouting needs to happen first.
//
//     // Set viable adjacent sources.
//     this.initAdjacentSources();
//
//     // Allocate existing LDHs to the respective sources.
//     this.initLDHarvesterAllocations();
//   }
//
//   run(...args: any[]): void {
//     if (spawner.spawning) return;
//
//     const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;
//
//     const ldHarvesters = gameState.getCreepCount(CreepTypes.ldh);
//     if ((this._adjacentSources.length * this._ldhsPerSource) > ldHarvesters) {
//       return this.spawnHarvester(availableEnergy);
//     }
//   }
//
// }
