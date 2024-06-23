import { COLLECT_STATE, collectStateSwitchAction } from "../../extensions/creeps/try-collect.extensions";
import { DELIVER_STATE, deliverStateSwitchAction } from "../../extensions/creeps/try-deliver.extensions";
import { CheckState } from "../../units-of-work/check-state";
import { Task, TaskArgs, TaskExecutor, TaskExecutorLoader } from "../Task";
import { TaskTypes } from "../TaskTypes";

export type HaulTaskArgs = { pickupPos: RoomPosition, dropOffPos: RoomPosition } & TaskArgs;

export class HaulTask extends Task {
  readonly type = TaskTypes.haul;
  readonly dropOffPos: RoomPosition;
  readonly collectPos: RoomPosition;

  constructor(args: HaulTaskArgs) {
    super(args);

    this.dropOffPos = args.dropOffPos;
    this.collectPos = args.pickupPos;
  }
}

export class HaulTaskExecutor extends TaskExecutor<HaulTask> {
  private readonly _checkState = new CheckState({
    [DELIVER_STATE]: {
      condition: creep => creep.isCollecting && creep.store.getFreeCapacity() === 0,
      action: creep => deliverStateSwitchAction(creep)
    },
    [COLLECT_STATE]: {
      condition: creep => creep.isDelivering && creep.store.getUsedCapacity() === 0,
      action: creep => collectStateSwitchAction(creep)
    }
  });

  run(creep: Creep) {
    if (!creep.isDelivering && !creep.isCollecting) {
      creep.memory.state = COLLECT_STATE;
    }

    creep.memory.state ??= COLLECT_STATE;
    this._checkState.check(creep);

    if (creep.isDelivering) {
      const { dropOffPos } = this.task;
      creep.tryDeliver({ pos: dropOffPos });
    }

    if (creep.isCollecting) {
      const { collectPos } = this.task;
      creep.tryCollect({ pos: collectPos });
    }
  }
}

TaskExecutorLoader.register(TaskTypes.haul, HaulTaskExecutor);