import { COLLECT_STATE, collectStateSwitchAction } from "../../extensions/creeps/creep-try-collect.extensions";
import { DELIVER_STATE, deliverStateSwitchAction } from "../../extensions/creeps/creep-try-deliver.extensions";
import { CheckState } from "../../units-of-work/check-state";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";
import { TaskTypes } from "../taskTypes";

export type HaulerTaskArgs = { pickupPos: RoomPosition, dropOffPos: RoomPosition } & TaskArgs;

export class HaulerTask extends Task {
  readonly type = TaskTypes.haul;
  readonly dropOffPos: RoomPosition;
  readonly collectPos: RoomPosition;

  constructor(args: HaulerTaskArgs) {
    super(args);

    this.dropOffPos = args.dropOffPos;
    this.collectPos = args.pickupPos;
  }
}

export class HaulerTaskExecutor extends TaskExecutor<HaulerTask> {
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