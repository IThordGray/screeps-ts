import { CreepSourceAllocationMap } from "abstractions/creep-allocation-map";
import { CreepTypes } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { Milestone } from "classes/milestone";
import { HarvestTask } from "creep-tasks/harvest.task";
import { haulerCreep, isHaulerMemory } from "creeps/hauler";
import { isMinerMemory, minerCreep } from "creeps/miner";
import { Logger } from "helpers/logger";
import { eventBus } from "singletons/event-bus";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { taskDistributor } from "singletons/task-distributor";


export class HarvestHaulerMilestone extends Milestone {

  private _minerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceMinerAllocationMap: { [sourceName: string]: string } = {};

  private _haulerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceHaulerAllocationMap: { [sourceName: string]: string } = {};


  private _roomSources = gameState.homeSpawn.room
    .find(FIND_SOURCES)
    .sort((a, b) => {
      const rangeA = gameState.homeSpawn.pos.getRangeTo(a);
      const rangeB = gameState.homeSpawn.pos.getRangeTo(b);
      return rangeA - rangeB;
    });

  private onCreepSpawn = (name: string) => {
    Logger.success(`Creep spawned: ${name}`);

    const creep = Game.creeps[name];

    if (isMinerMemory(creep.memory)) {
      this._minerSourceAllocationMap[name] = creep.memory.target;
      this._sourceMinerAllocationMap[creep.memory.target] = name;
    }

    if (isHaulerMemory(creep.memory)) {
      this._haulerSourceAllocationMap[name] = creep.memory.target;
      this._sourceHaulerAllocationMap[creep.memory.target] = name;
    }
  };

  private onCreepDeath = (memory: CreepMemory & { name: string }) => {
    Logger.warn(`Creep died: ${memory.name}`);

    if (isMinerMemory(memory)) {
      delete this._minerSourceAllocationMap[memory.name];
      delete this._sourceMinerAllocationMap[memory.target];
    }

    if (isHaulerMemory(memory)) {
      delete this._haulerSourceAllocationMap[memory.name];
      delete this._sourceHaulerAllocationMap[memory.target];
    }
  };

  constructor() {
    super();

    this._roomSources.forEach((source) => {
      gameState.sources[source.id] = source;
    });

    this.initMinerAllocations();

    this.initHaulerAllocations();

    eventBus.on(EventTypes.creepDied, this.onCreepDeath.bind(this));
    eventBus.on(EventTypes.creepSpawned, this.onCreepSpawn.bind(this));
  }

  private initHaulerAllocations() {
    const { refs: haulers } = gameState.creeps[CreepTypes.hauler] ?? {};
    haulers?.forEach(x => {
      if (!isHaulerMemory(x.memory)) return;
      if (!x.memory.target) return;

      this._haulerSourceAllocationMap[x.name] = x.memory.target;
      this._sourceHaulerAllocationMap[x.memory.target] = x.name;
    });
  }

  private initMinerAllocations() {
    const { refs: miners } = gameState.creeps[CreepTypes.miner] ?? {};
    miners?.forEach(x => {
      if (!isMinerMemory(x.memory)) return;
      if (!x.memory.target) return;

      this._minerSourceAllocationMap[x.name] = x.memory.target;
      this._sourceMinerAllocationMap[x.memory.target] = x.name;
    });
  }

  private spawnMiner(cost: number) {
    const source = this._roomSources.find(x => !this._sourceMinerAllocationMap[x.id]);
    console.log('Miner sourceId: ', source?.id);
    if (!source) return;

    spawner.spawnMiner(cost, source.id);
  }

  private spawnHauler(cost: number) {
    const source = this._roomSources.find(x => !this._sourceHaulerAllocationMap[x.id]);
    console.log('Hauler sourceId: ', source?.id);
    if (!source) return;

    spawner.spawnHauler(cost, source.id);
  }

  init(): void {
    taskDistributor.addTask(new HarvestTask());
  }

  condition(...args: any[]) {
    const miners = gameState.getCreepCount(CreepTypes.miner);
    if (miners < this._roomSources.length) return false;

    const haulers = gameState.getCreepCount(CreepTypes.hauler);
    if (miners !== haulers) return false;

    return true;
  }

  run(...args: any[]) {
    if (spawner.spawning) return;

    const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;
    const combinedCost = minerCreep.minCost + haulerCreep.minCost;
    const multiplier = Math.floor(availableEnergy / combinedCost);

    const miners = gameState.getCreepCount(CreepTypes.miner);

    // I have sources, but no miners.
    if (!miners && this._roomSources.length) {
      Logger.info('I have sources, but no miners.')
      const cost = minerCreep.minCost * multiplier;
      return this.spawnMiner(cost);
    }

    const haulers = gameState.getCreepCount(CreepTypes.hauler);

    // I have some miners and hauler, but there are more haulers than miners.
    if (miners < haulers && this._roomSources.length) {
      Logger.info('I have more haulers than miners.')
      return this.spawnMiner(availableEnergy);
    }

    // I have some miners and haulers, but there are more miners than haulers.
    if (miners > haulers) {
      Logger.info('I have more miners than haulers.')
      return this.spawnHauler(availableEnergy);
    }

    // I have the same amount of miners and haulers, but there are still unallocated sources available.
    if (this._roomSources.length > miners) {
      Logger.info('I have unallocated sources available for mining.')
      return this.spawnMiner(availableEnergy);
    }
  }
}
