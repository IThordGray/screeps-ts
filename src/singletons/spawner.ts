import { CreepTypes } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { droneCreep } from "creeps/drone";
import { haulerCreep } from "creeps/hauler";
import { ldHarvesterCreep } from "creeps/long-distance-harvester";
import { minerCreep } from "creeps/miner";
import { scoutScreep } from "creeps/scout";
import { eventBus } from "./event-bus";
import { gameState } from "./game-state";

class Spawner {
  private _currentlySpawning: string | undefined;

  get spawning() {
    return gameState.homeSpawn.spawning;
  }

  spawnDrone(budget: number) {
    if (this.spawning) return;
    const memory: any = { role: CreepTypes.drone, working: false };
    const name = droneCreep.getName();
    gameState.homeSpawn.spawnCreep(droneCreep.getBody(budget), name, { memory });
  }

  spawnHauler(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.hauler, working: false, target: sourceId };
    const name = haulerCreep.getName();
    gameState.homeSpawn.spawnCreep(haulerCreep.getBody(budget), name, { memory });
  }

  spawnLdHarvester(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.ldh, working: false, target: sourceId };
    const name = ldHarvesterCreep.getName();
    gameState.homeSpawn.spawnCreep(ldHarvesterCreep.getBody(budget), name, { memory });
  }

  spawnMiner(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.miner, working: false, target: sourceId };
    const name = minerCreep.getName();
    gameState.homeSpawn.spawnCreep(minerCreep.getBody(budget), name, { memory });
  }

  spawnScout(budget: number, roomIds: string[]) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.scout, working: false, target: roomIds[0], roomIds: roomIds };
    const name = scoutScreep.getName();
    gameState.homeSpawn.spawnCreep(scoutScreep.getBody(budget), name, { memory });
  }

  update() {
    if (this.spawning) {
      this._currentlySpawning = this.spawning.name;
    }

    if (!this.spawning && this._currentlySpawning) {
      eventBus.emit(EventTypes.creepSpawned, this._currentlySpawning);
      this._currentlySpawning = undefined;
    }
  }
}

export const spawner = new Spawner();
