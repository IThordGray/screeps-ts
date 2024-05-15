import { CreepType, CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { droneCreep } from "creeps/drone";
import { haulerCreep } from "creeps/hauler";
import { ldHarvesterCreep } from "creeps/ldh";
import { minerCreep } from "creeps/miner";
import { scoutCreep } from "creeps/scout";
import { OnInit, OnRun } from "../abstractions/interfaces";

class CreepManager implements OnRun {

  readonly creepTypeMap = new Map<CreepType, BaseCreep>([
    [ CreepTypes.miner, minerCreep ],
    [ CreepTypes.hauler, haulerCreep ],
    [ CreepTypes.scout, scoutCreep ],
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
