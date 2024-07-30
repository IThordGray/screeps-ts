import { COLLECT_STATE } from "../../extensions/creeps/TryCollectExtension";
import { UPGRADE_STATE, upgradeStateSwitchAction } from "../../extensions/creeps/TryUpgradingExtension";
import { withdrawStateSwitchAction } from "../../extensions/creeps/TryWithdrawExtension";
import { CheckState } from "../../units-of-work/check-state";
import { BaseTask, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../BaseTask";
import { TaskTypes } from "../TaskTypes";

export type SUpgraderDrone = Creep & { memory: { task: StationaryUpgradeTaskArgs } }

export type StationaryUpgradeTaskArgs = TaskArgs & {
  pos: RoomPosition;
  controllerId: Id<StructureController>;
  collectPos: RoomPosition;
}

export class StationaryUpgradeTask extends BaseTask {
  override type = TaskTypes.stationaryUpgrade;
  readonly controllerId: Id<StructureController>;
  readonly collectPos: RoomPosition;

  constructor(args: StationaryUpgradeTaskArgs) {
    super(args);

    this.controllerId = args.controllerId;
    this.collectPos = args.collectPos;
  }
}

export class StationaryUpgradeTaskExecutor extends TaskExecutor<StationaryUpgradeTask> {

  private readonly _checkState = new CheckState({
    [COLLECT_STATE]: {
      condition: creep => creep.isUpgrading && creep.store.getUsedCapacity() === 0,
      action: creep => withdrawStateSwitchAction(creep)
    },
    [UPGRADE_STATE]: {
      condition: creep => creep.isCollecting && creep.store.getFreeCapacity() === 0,
      action: creep => upgradeStateSwitchAction(creep)
    }
  });

  run(creep: SUpgraderDrone): any {
    if (!creep.isUpgrading && !creep.isCollecting) {
      creep.isUpgrading = true;
    }

    this._checkState.check(creep);

    if (creep.isUpgrading) {
      const targetId = this.task.controllerId;
      creep.tryUpgrade({ targetId });
    }

    if (creep.isCollecting) {
      creep.tryCollect({ pos: creep.memory.task.collectPos, scavengeRange: 1 });
    }
  }
}

TaskExecutorLoader.register(TaskTypes.stationaryUpgrade, StationaryUpgradeTaskExecutor);
