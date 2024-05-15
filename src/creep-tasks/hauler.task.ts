import { CreepTask } from "classes/task";
import { Collect } from "units-of-work/collect";
import { Deliver } from "units-of-work/deliver";
import { CheckState } from "../units-of-work/check-state";

export class HaulerTask extends CreepTask {

  private readonly _target: RoomPosition | null;
  private readonly _destination: AnyStoreStructure | null;

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
    getTarget: () => this._destination
  });

  private readonly _collect = new Collect({
    getTarget: () => this._target
  });

  constructor(args: {
    target: RoomPosition | null,
    destination: AnyStoreStructure | null
  }) {
    super();

    this._target = args.target;
    this._destination = args.destination;
  }

  run(creep: Creep) {
    creep.memory.state ??= Collect.state;
    this._checkState.check(creep);

    if (creep.memory.state === Deliver.state) this._deliver.run(creep);
    if (creep.memory.state === Collect.state) this._collect.run(creep);
  }

}
