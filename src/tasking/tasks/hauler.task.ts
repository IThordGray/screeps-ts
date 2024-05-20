import { Task, TaskArgs } from "tasking/task";
import { Collect, IMemoryCanCollect } from "units-of-work/collect";
import { Deliver, IMemoryCanDeliver } from "units-of-work/deliver";
import { CheckState } from "../../units-of-work/check-state";
import { TaskExecutor } from "../taskExecutor";
import { TaskType } from "../taskType";

export type HaulerTaskArgs = { pickupPos: RoomPosition, dropOffPos: RoomPosition } & TaskArgs;
export class HaulerTask extends Task implements IMemoryCanCollect, IMemoryCanDeliver {
  readonly type = TaskType.haul;
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
    [Deliver.state]: {
      condition: creep => creep.memory.state === Collect.state && creep.store.getFreeCapacity() === 0,
      action: creep => Deliver.action(creep)
    },
    [Collect.state]: {
      condition: creep => creep.memory.state === Deliver.state && creep.store.getUsedCapacity() === 0,
      action: creep => Collect.action(creep)
    }
  });

  private readonly _deliver = new Deliver({
    getPosition: () => this.task.dropOffPos
  });

  private readonly _collect = new Collect({
    getPosition: () => this.task.collectPos
  });

  run(creep: Creep) {
    creep.memory.state ??= Collect.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Collect.state) this._collect.run(creep);
  }
}