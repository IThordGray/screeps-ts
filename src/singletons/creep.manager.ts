import { CreepType, CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { genericDroneCreep } from "creeps/drone";
import { haulerCreep } from "creeps/hauler";
import { ldHarvesterCreep } from "creeps/ldh";
import { minerCreep } from "creeps/miner";
import { scoutCreep } from "creeps/scout";
import { harvesterCreep } from "../creeps/harvester";
import { RoomState } from "./game-state";

export class CreepManager {

  private readonly _roomState = RoomState.get(this._room.name);

  readonly creepTypeMap = new Map<CreepType, BaseCreep>([
    [ CreepTypes.miner, minerCreep ],
    [ CreepTypes.hauler, haulerCreep ],
    [ CreepTypes.scout, scoutCreep ],
    [ CreepTypes.ldh, ldHarvesterCreep ],
    [ CreepTypes.genericDrone, genericDroneCreep ],
    [ CreepTypes.harvester, harvesterCreep ],
  ]);

  constructor(
    private readonly _room: Room
  ) { }

  run() {
    const creepTypes = this.creepTypeMap.values();

    for (const creepType of creepTypes) {
      const creeps = _.filter(Game.creeps, creep => creep.memory.role === creepType.role);
      creeps.forEach(creep => creepType.run(creep));
    }
  }
}
