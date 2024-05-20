import { Deliver } from "units-of-work/deliver";
import { Harvest, IMemoryCanHarvest } from "units-of-work/harvest";
import { RoomState } from "../../singletons/game-state";
import { CheckState } from "../../units-of-work/check-state";
import { Task, TaskArgs } from "../task";
import { TaskExecutor } from "../taskExecutor";
import { TaskType } from "../taskType";

export type HarvestTaskArgs = { sourceId: Id<Source> } & TaskArgs;

export class HarvestTask extends Task implements IMemoryCanHarvest {
  readonly type = TaskType.harvest;
  readonly sourceId: Id<Source>;

  constructor(args: HarvestTaskArgs) {
    super(args);

    this.sourceId = args.sourceId;
  }
}

export class HarvestTaskExecutor extends TaskExecutor<HarvestTask> {
  private readonly _checkState = new CheckState({
    [Deliver.state]: {
      condition: creep => creep.memory.state === Harvest.state && creep.store.getFreeCapacity() === 0,
      action: creep => Deliver.action(creep)
    },
    [Harvest.state]: {
      condition: creep => creep.memory.state === Deliver.state && creep.store.getUsedCapacity() === 0,
      action: creep => Harvest.action(creep)
    }
  });

  private readonly _harvest = new Harvest({
    getPosition: () => this.task.pos,
    getTarget: () => Game.getObjectById(this.task.sourceId)
  });

  private readonly _deliver = new Deliver({
    getPosition: (creep: Creep) => RoomState.get(creep.memory.room).spawn.pos,
    getTarget: (creep: Creep) => Deliver.defaultTarget(creep)
  });

  run(creep: Creep) {
    creep.memory.state ??= Harvest.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Harvest.state) this._harvest.run(creep);
  }
}