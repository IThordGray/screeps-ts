import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/BaseCreep";
import { genericDroneCreep } from "../creeps/GenericDrone";
import { haulerCreep } from "../creeps/Hauler";
import { minerCreep } from "../creeps/Miner";
import { scoutCreep } from "../creeps/Scout";

export class CreepManager implements ICreepManager {

  readonly creepTypeMap = new Map<CreepType, BaseCreep>([
    [ CreepTypes.miner, minerCreep ],
    [ CreepTypes.hauler, haulerCreep ],
    [ CreepTypes.scout, scoutCreep ],
    [ CreepTypes.genericDrone, genericDroneCreep ],
  ]);

  constructor(
    private readonly _room: Room
  ) { }

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
