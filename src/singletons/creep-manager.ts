import { CreepType, CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { droneCreep } from "creeps/drone";
import { haulerCreep } from "creeps/hauler";
import { ldHarvesterCreep } from "creeps/long-distance-harvester";
import { minerCreep } from "creeps/miner";
import { scoutScreep } from "creeps/scout";

class CreepManager {

  readonly creepTypeMap = new Map<CreepType, BaseCreep>([
    [ CreepTypes.miner, minerCreep ],
    [ CreepTypes.hauler, haulerCreep ],
    [ CreepTypes.scout, scoutScreep ],
    [ CreepTypes.ldh, ldHarvesterCreep ],
    [ CreepTypes.drone, droneCreep ]
  ]);

  run(...args: any[]) {
    const runCreep = (creep: Creep) => {
      const { role } = creep.memory;
      const creepType = this.creepTypeMap.get(role);
      if (!creepType) return;

      creepType.run(creep);
    };

    _.forEach(Game.creeps, creep => runCreep(creep));
  }
}

export const creepManager = new CreepManager();
