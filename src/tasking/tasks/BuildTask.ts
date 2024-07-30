import { BUILD_STATE, buildStateSwitchAction } from "../../extensions/creeps/TryBuildExtension";
import { COLLECT_STATE } from "../../extensions/creeps/TryCollectExtension";
import { withdrawStateSwitchAction } from "../../extensions/creeps/TryWithdrawExtension";
import { CheckState } from "../../units-of-work/check-state";
import { BaseTask, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../BaseTask";
import { TaskTypes } from "../TaskTypes";

export type BuilderDrone = Creep & { memory: { task: BuildTaskArgs } }

export type BuildTaskArgs = TaskArgs & {
  structureType?: BuildableStructureConstant;
  constructionSiteId?: Id<ConstructionSite>;
};

export class BuildTask extends BaseTask {
  override type = TaskTypes.build;
  readonly structureType?: BuildableStructureConstant;
  readonly constructionSiteId?: Id<ConstructionSite>;

  constructor(args: BuildTaskArgs) {
    super(args);

    this.structureType = args.structureType;
    this.constructionSiteId = args.constructionSiteId;
  }
}

export class BuildTaskExecutor extends TaskExecutor<BuildTask> {

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
      const [ container ] = Game.rooms[creep.memory.room].owned.state.structureState.getContainers();
      const [ source ] = Game.rooms[creep.memory.room].owned.state.resourceState.getSources();

      if (container) return creep.tryWithdraw({ target: container });

      const droppedResources = source.pos?.findInRange(FIND_DROPPED_RESOURCES, 5) ?? [];
      droppedResources.sort((a, b) => b.amount - a.amount);
      const [ resource ] = droppedResources;
      if (resource && resource.amount > 250) return creep.tryCollect({ target: resource });

      return creep.tryHarvest({ target: source });
    }
  }
}

TaskExecutorLoader.register(TaskTypes.build, BuildTaskExecutor);