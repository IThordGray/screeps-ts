import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/base-creep";
import { genericDroneCreep } from "../creeps/generic-drone";
import { haulerCreep } from "../creeps/hauler";
import { minerCreep } from "../creeps/miner";
import { scoutCreep } from "../creeps/scout";

export class CreepManager implements ICreepManager {

  // get state() { this._room.state }

  readonly creepTypeMap = new Map<CreepType, BaseCreep>([
    [ CreepTypes.miner, minerCreep ],
    [ CreepTypes.hauler, haulerCreep ],
    [ CreepTypes.scout, scoutCreep ],
    [ CreepTypes.genericDrone, genericDroneCreep ],
  ]);

  // minerCount = () => this._room.owned.state.creepState.getCreeps(CreepTypes.miner)?.length ?? 0;

  constructor(
    private readonly _room: Room
  ) {

    console.log('Creep manager constructed');

  }

  run() {
    const creepTypes = this.creepTypeMap.values();

    for (const creepType of creepTypes) {
      const creeps = _.filter(Game.creeps, creep => creep.memory.role === creepType.role);
      creeps.forEach(creep => {
        creepType.run(creep);
      });
    }
  }
}
