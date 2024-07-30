import { CreepExecutorLoader } from "../creeps/BaseCreep";

export class CreepManager implements ICreepManager {
  run() {
    _.forEach(Game.creeps, creep => {
      CreepExecutorLoader.get(creep)?.run();
    });
  }
}
