import { CreepTypes } from "abstractions/creep-types";
import { EventTypes } from "abstractions/event-types";
import { droneCreep } from "creeps/drone";
import { haulerCreep } from "creeps/hauler";
import { ldHarvesterCreep } from "creeps/ldh";
import { minerCreep } from "creeps/miner";
import { scoutCreep } from "creeps/scout";
import { OnRun, OnUpdate } from "../abstractions/interfaces";
import { eventBus } from "./event-bus";
import { gameState } from "./game-state";

class Spawner implements OnUpdate, OnRun {
  private _currentlySpawning: string | undefined;

  get spawning() {
    return gameState.homeSpawn.spawning;
  }

  run() {
    if (this.spawning) return;
    if (!this._currentlySpawning) return;

    const creep = Game.creeps[this._currentlySpawning];
    if (creep) return;

    eventBus.emit(EventTypes.creepSpawned, creep);
    this._currentlySpawning = undefined;
  }

  spawnDrone(budget: number) {
    if (this.spawning) return;
    const memory: any = { role: CreepTypes.drone };
    const name = droneCreep.getName();
    gameState.homeSpawn.spawnCreep(droneCreep.getBody(budget), name, { memory });
  }

  spawnHauler(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.hauler, target: sourceId };
    const name = haulerCreep.getName();
    gameState.homeSpawn.spawnCreep(haulerCreep.getBody(budget), name, { memory });
  }

  spawnLdHarvester(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.ldh, target: sourceId };
    const name = ldHarvesterCreep.getName();
    gameState.homeSpawn.spawnCreep(ldHarvesterCreep.getBody(budget), name, { memory });
  }

  spawnMiner(budget: number, sourceId: Id<Source>) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.miner, target: sourceId };
    const name = minerCreep.getName();
    gameState.homeSpawn.spawnCreep(minerCreep.getBody(budget), name, { memory });
  }

  spawnScout(budget: number, roomIds: string[]) {
    if (!!this.spawning) return;
    const memory: any = { role: CreepTypes.scout, target: roomIds[0], roomIds: roomIds };
    const name = scoutCreep.getName();
    gameState.homeSpawn.spawnCreep(scoutCreep.getBody(budget), name, { memory });
  }

  update() {
    if (this.spawning) this._currentlySpawning = this.spawning.name;
  }
}

export const spawner = new Spawner();
