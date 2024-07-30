import { DELIVER_STATE, deliverStateSwitchAction } from "../../extensions/creeps/TryDeliverExtension";
import { HARVEST_STATE, harvestStateSwitchAction } from "../../extensions/creeps/TryHarvestExtension";
import { CheckState } from "../../units-of-work/check-state";
import { BaseTask, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../BaseTask";
import { TaskTypes } from "../TaskTypes";

export type HarvestTaskArgs = { sourceId: Id<Source> } & TaskArgs;

export class HarvestTask extends BaseTask {
  readonly type = TaskTypes.harvest;
  readonly sourceId: Id<Source>;

  constructor(args: HarvestTaskArgs) {
    super(args);

    this.sourceId = args.sourceId;
  }
}

export class HarvestTaskExecutor extends TaskExecutor<HarvestTask> {
  private readonly _checkState = new CheckState({
    [DELIVER_STATE]: {
      condition: creep => creep.isHarvesting && creep.store.getFreeCapacity() === 0,
      action: creep => deliverStateSwitchAction(creep)
    },
    [HARVEST_STATE]: {
      condition: creep => creep.isDelivering && creep.store.getUsedCapacity() === 0,
      action: creep => harvestStateSwitchAction(creep)
    }
  });

  run(creep: Creep) {
    if (!creep.isDelivering && !creep.isHarvesting) {
      creep.isHarvesting = true;
    }

    this._checkState.check(creep);

    if (creep.isDelivering) {
      const target = creep.room.storage || creep.room.terminal || creep.room.find(FIND_STRUCTURES, {
        filter: (s => (
          (s.structureType === STRUCTURE_EXTENSION ||
            s.structureType === STRUCTURE_SPAWN ||
            s.structureType === STRUCTURE_TOWER) &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ))
      })[0];

      creep.tryDeliver({ target });
    }


    if (creep.isHarvesting) creep.tryHarvest({ targetId: this.task.sourceId });
  }
}

TaskExecutorLoader.register(TaskTypes.harvest, HarvestTaskExecutor);