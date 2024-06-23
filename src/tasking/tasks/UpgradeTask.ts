import { COLLECT_STATE } from "../../extensions/creeps/try-collect.extensions";
import { UPGRADE_STATE, upgradeStateSwitchAction } from "../../extensions/creeps/try-upgrading.extensions";
import { withdrawStateSwitchAction } from "../../extensions/creeps/try-withdraw.extensions";
import { CheckState } from "../../units-of-work/check-state";
import { IMemoryCanUpgrade } from "../../units-of-work/upgrade";
import { Task, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../Task";
import { TaskTypes } from "../TaskTypes";

export type UpgraderDrone = Creep & { memory: { task: UpgradeTaskArgs } }

export type UpgradeTaskArgs = IMemoryCanUpgrade & TaskArgs;

export class UpgradeTask extends Task {
  override type = TaskTypes.upgrade;
  readonly controllerId: Id<StructureController>;

  constructor(args: UpgradeTaskArgs) {
    super(args);

    this.controllerId = args.controllerId;
  }
}

export class UpgradeTaskExecutor extends TaskExecutor<UpgradeTask> {

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

TaskExecutorLoader.register(TaskTypes.upgrade, UpgradeTaskExecutor);
