import { BUILD_STATE, buildStateSwitchAction } from "../../helpers/creeps/creep-try-build.extensions";
import { WITHDRAW_STATE, withdrawStateSwitchAction } from "../../helpers/creeps/creep-try-withdraw.extensions";
import { RoomState } from "../../states/roomState";
import { CheckState } from "../../units-of-work/check-state";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";
import { TaskType } from "../taskType";

export type BuildTaskArgs = TaskArgs & {
  structureType?: BuildableStructureConstant;
  constructionSiteId?: Id<ConstructionSite>;
};

export class BuildTask extends Task {
  override type = TaskType.build;
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
    [WITHDRAW_STATE]: {
      condition: creep => creep.isBuilding && creep.store.getUsedCapacity() === 0,
      action: creep => withdrawStateSwitchAction(creep)
    },
    [BUILD_STATE]: {
      condition: creep => creep.isWithdrawing && creep.store.getFreeCapacity() === 0,
      action: creep => buildStateSwitchAction(creep)
    }
  });

  run(creep: Creep): void {
    if (!creep.isWithdrawing && !creep.isBuilding) {
      creep.isBuilding = true;
    }
    this._checkState.check(creep);

    if (creep.isBuilding) {
      const { pos } = creep;
      return creep.tryBuild({ pos });
    }

    if (creep.isWithdrawing) {
      const [ container ] = Game.rooms[creep.memory.room].owned.state.structureState.getContainers();
      const [ source ] = Game.rooms[creep.memory.room].owned.state.resourceState.getSources();

      container
        ? creep.tryWithdraw({ target: container })
        : creep.tryHarvest({ target: source });
    }
  }
}
