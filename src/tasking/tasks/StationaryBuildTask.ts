import { BUILD_STATE, buildStateSwitchAction } from "../../extensions/creeps/TryBuildExtension";
import { COLLECT_STATE } from "../../extensions/creeps/TryCollectExtension";
import { withdrawStateSwitchAction } from "../../extensions/creeps/TryWithdrawExtension";
import { CheckState } from "../../units-of-work/check-state";
import { BaseTask, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../BaseTask";
import { TaskTypes } from "../TaskTypes";
import { BuilderDrone, BuildTaskArgs } from "./BuildTask";

export type SBuilderDrone = Creep & { memory: { task: StationaryBuildTaskArgs } }

export type StationaryBuildTaskArgs = TaskArgs & {
  structureType?: BuildableStructureConstant;
  constructionSiteId?: Id<ConstructionSite>;
  collectPos: RoomPosition;
};

export class StationaryBuildTask extends BaseTask {
  override type = TaskTypes.stationaryBuild;
  readonly structureType?: BuildableStructureConstant;
  readonly constructionSiteId?: Id<ConstructionSite>;
  readonly collectPos: RoomPosition;

  constructor(args: StationaryBuildTaskArgs) {
    super(args);

    this.structureType = args.structureType;
    this.constructionSiteId = args.constructionSiteId;
    this.collectPos = args.collectPos;
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

  run(creep: SBuilderDrone): any {
    if (!creep.isCollecting && !creep.isBuilding) {
      creep.isBuilding = true;
    }
    this._checkState.check(creep);

    if (creep.isBuilding) {
      const { pos } = creep;
      return creep.tryBuild({ pos });
    }

    if (creep.isCollecting) {
      creep.tryCollect({ pos: creep.memory.task.collectPos, scavengeRange: 1 });
    }
  }
}

TaskExecutorLoader.register(TaskTypes.stationaryBuild, StationaryBuildTaskExecutor);