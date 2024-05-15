import { CreepTypes } from "abstractions/creep-types";
import { Milestone } from "classes/milestone";
import { haulerCreep, HaulerMemory } from "creeps/hauler";
import { minerCreep, MinerMemory } from "creeps/miner";
import { Logger } from "helpers/logger";
import { gameState } from "singletons/game-state";
import { spawner } from "singletons/spawner";
import { HarvestTask } from "../../creep-tasks/harvest.task";
import { HaulerTask } from "../../creep-tasks/hauler.task";
import { taskDistributor } from "../../singletons/task-distributor";

export class MiningMilestone extends Milestone {

  private _minerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceMinerAllocationMap: { [sourceName: string]: string } = {};

  private _haulerSourceAllocationMap: { [creepName: string]: string } = {};
  private _sourceHaulerAllocationMap: { [sourceName: string]: string } = {};

  private readonly _roomSources = gameState.homeSpawn.room
    .find(FIND_SOURCES)
    .sort((a, b) => {
      const rangeA = gameState.homeSpawn.pos.getRangeTo(a);
      const rangeB = gameState.homeSpawn.pos.getRangeTo(b);
      return rangeA - rangeB;
    });

  constructor() {
    super();

    this._roomSources.forEach((source) => {
      gameState.sources[source.id] = source;
    });
  }

  private initHaulerAllocations() {
    this._haulerSourceAllocationMap = {};
    this._sourceHaulerAllocationMap = {};

    const haulerState = gameState.creeps[CreepTypes.hauler];
    if (!haulerState?.creeps?.length) return;

    haulerState.creeps.forEach(creep => {
      const memory = creep.memory as HaulerMemory;
      if (!memory.target) return;

      this._haulerSourceAllocationMap[creep.name] = memory.target;
      this._sourceHaulerAllocationMap[memory.target] = creep.name;
    });
  }

  private initMinerAllocations() {
    this._minerSourceAllocationMap = {};
    this._sourceMinerAllocationMap = {};

    const minerState = gameState.creeps[CreepTypes.miner];
    if (!minerState?.creeps?.length) return;

    minerState.creeps.forEach(creep => {
      const memory = creep.memory as MinerMemory;
      if (!memory.target) return;

      this._minerSourceAllocationMap[creep.name] = memory.target;
      this._sourceMinerAllocationMap[memory.target] = creep.name;
    });
  }

  private spawnHauler(cost: number) {
    const source = this._roomSources.find(x => !this._sourceHaulerAllocationMap[x.id]);
    if (!source) return;

    spawner.spawnHauler(cost, source.id);
  }

  private spawnMiner(cost: number) {
    const source = this._roomSources.find(x => !this._sourceMinerAllocationMap[x.id]);
    if (!source) return;

    spawner.spawnMiner(cost, source.id);
  }

  condition() {
    const miners = gameState.getCreepCount(CreepTypes.miner);
    if (miners < this._roomSources.length) return false;

    const haulers = gameState.getCreepCount(CreepTypes.hauler);
    if (miners !== haulers) return false;

    return true;
  }

  run() {
    if (spawner.spawning) return;

    const availableEnergy = gameState.homeSpawn.room.energyCapacityAvailable;
    const combinedCost = minerCreep.minCost + haulerCreep.minCost;
    const multiplier = Math.floor(availableEnergy / combinedCost);

    const miners = gameState.getCreepCount(CreepTypes.miner);

    // I have sources, but no miners.
    if (!miners && this._roomSources.length) {
      Logger.info("I have sources, but no miners.");
      const cost = minerCreep.minCost * multiplier;
      return this.spawnMiner(cost);
    }

    const haulers = gameState.getCreepCount(CreepTypes.hauler);

    // I have some miners and hauler, but there are more haulers than miners.
    if (miners < haulers && this._roomSources.length) {
      Logger.info("I have more haulers than miners.");
      return this.spawnMiner(availableEnergy);
    }

    // I have some miners and haulers, but there are more miners than haulers.
    if (miners > haulers) {
      Logger.info("I have more miners than haulers.");
      return this.spawnHauler(availableEnergy);
    }

    // I have the same amount of miners and haulers, but there are still unallocated sources available.
    if (this._roomSources.length > miners) {
      Logger.info("I have unallocated sources available for mining.");
      return this.spawnMiner(availableEnergy);
    }
  }

  update() {
    super.update();

    this.initMinerAllocations();
    this.initHaulerAllocations();

    const miners = gameState.getCreepCount(CreepTypes.miner);
    const haulers = gameState.getCreepCount(CreepTypes.miner);

    if (miners === 1 && haulers === 0) {
      const miner = gameState.creeps[CreepTypes.miner].creeps[0];
      const memory = miner.memory as MinerMemory;

      taskDistributor.removeCreepTasks(task => task instanceof HarvestTask);
      taskDistributor.addTask(new HaulerTask({
        target: gameState.sources[memory.target].pos,
        destination: gameState.homeSpawn
      }));
    }
  }
}
