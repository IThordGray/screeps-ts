import { BUILD_STATE, buildStateSwitchAction } from "../../extensions/creeps/try-build.extensions";
import { COLLECT_STATE } from "../../extensions/creeps/try-collect.extensions";
import { withdrawStateSwitchAction } from "../../extensions/creeps/try-withdraw.extensions";
import { CheckState } from "../../units-of-work/check-state";
import { Task, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../Task";
import { TaskTypes } from "../TaskTypes";

export type StationaryBuildTaskArgs = TaskArgs & {
  structureType?: BuildableStructureConstant;
  constructionSiteId?: Id<ConstructionSite>;
};

export class StationaryBuildTask extends Task {
  override type = TaskTypes.stationaryBuild;
  readonly structureType?: BuildableStructureConstant;
  readonly constructionSiteId?: Id<ConstructionSite>;

  constructor(args: StationaryBuildTaskArgs) {
    super(args);

    this.structureType = args.structureType;
    this.constructionSiteId = args.constructionSiteId;
  }
}

export class StationaryBuildTaskExecutor extends TaskExecutor<StationaryBuildTask> {

  private readonly _checkState = new CheckState({
    [COLLECT_STATE]: {
      condition: creep => creep.isBuilding && creep.store.getUsedCapacity() === 0,
      action: creep => withdrawStateSwitchAction(creep)
    },

    [BUILD_STATE]: {
      condition: creep => (creep.isCollecting) && creep.store.getFreeCapacity() === 0,
      action: creep => buildStateSwitchAction(creep)
    }
  });

  run(creep: Creep): any {
    if (!creep.isCollecting && !creep.isBuilding) {
      creep.isBuilding = true;
    }
    this._checkState.check(creep);

    if (creep.isBuilding) {
      const { pos } = creep;
      return creep.tryBuild({ pos });
    }

    if (creep.isCollecting) {
      /* Notify haulers that I am receiving */
    }
  }
}

TaskExecutorLoader.register(TaskTypes.stationaryBuild, StationaryBuildTaskExecutor);