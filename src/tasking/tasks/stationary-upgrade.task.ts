import { isHaulerMemory } from "../../creeps/hauler";
import { COLLECT_STATE } from "../../extensions/creeps/creep-try-collect.extensions";
import { UPGRADE_STATE, upgradeStateSwitchAction } from "../../extensions/creeps/creep-try-upgrading.extensions";
import { withdrawStateSwitchAction } from "../../extensions/creeps/creep-try-withdraw.extensions";
import { CheckState } from "../../units-of-work/check-state";
import { IMemoryCanUpgrade } from "../../units-of-work/upgrade";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";
import { TaskTypes } from "../taskTypes";

export type StationaryUpgradeTaskArgs = IMemoryCanUpgrade & TaskArgs;

export class StationaryUpgradeTask extends Task {
  override type = TaskTypes.stationaryUpgrade;
  readonly controllerId: Id<StructureController>;

  constructor(args: StationaryUpgradeTaskArgs) {
    super(args);

    this.controllerId = args.controllerId;
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

  run(creep: Creep): any {
    if (!creep.isUpgrading && !creep.isCollecting) {
      creep.isUpgrading = true;
    }

    this._checkState.check(creep);

    if (creep.isUpgrading) {
      const targetId = this.task.controllerId;
      creep.tryUpgrade({ targetId });
    }

    if (creep.isCollecting) {

    }
  }
}
