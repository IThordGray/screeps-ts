import { UPGRADE_STATE, upgradeStateSwitchAction } from "../../helpers/creeps/creep-try-upgrading.extensions";
import { WITHDRAW_STATE, withdrawStateSwitchAction } from "../../helpers/creeps/creep-try-withdraw.extensions";
import { RoomState } from "../../states/roomState";
import { CheckState } from "../../units-of-work/check-state";
import { IMemoryCanUpgrade } from "../../units-of-work/upgrade";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";
import { TaskType } from "../taskType";

export type UpgradeTaskArgs = IMemoryCanUpgrade & TaskArgs;

export class UpgradeTask extends Task {
  override type = TaskType.upgrade;
  readonly controllerId: Id<StructureController>;

  constructor(args: UpgradeTaskArgs) {
    super(args);

    this.controllerId = args.controllerId;
  }
}

export class UpgradeTaskExecutor extends TaskExecutor<UpgradeTask> {

  private readonly _checkState = new CheckState({
    [WITHDRAW_STATE]: {
      condition: creep => creep.isUpgrading && creep.store.getUsedCapacity() === 0,
      action: creep => withdrawStateSwitchAction(creep)
    },
    [UPGRADE_STATE]: {
      condition: creep => creep.isWithdrawing && creep.store.getFreeCapacity() === 0,
      action: creep => upgradeStateSwitchAction(creep)
    }
  });

  run(creep: Creep): void {
    if (!creep.isUpgrading && !creep.isWithdrawing) {
      creep.isUpgrading = true;
    }

    this._checkState.check(creep);

    if (creep.isUpgrading) {
      const targetId = this.task.controllerId;
      creep.tryUpgrade({ targetId });
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
