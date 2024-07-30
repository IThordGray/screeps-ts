import { CreepTypes } from "../../abstractions/CreepTypes";
import { COLLECT_STATE, collectStateSwitchAction } from "../../extensions/creeps/TryCollectExtension";
import { DELIVER_STATE, deliverStateSwitchAction } from "../../extensions/creeps/TryDeliverExtension";
import { TaskTypes } from "../../tasking/TaskTypes";
import { CheckState } from "../../units-of-work/check-state";
import { PosUtils } from "../../utils/pos.utils";
import { BaseCreep, CreepExecutor, CreepExecutorLoader } from "../BaseCreep";

export class HaulerNeed {
  readonly creepType = CreepTypes.hauler;

  constructor(
    public readonly budget: number,
    public readonly memory?: Partial<HaulerMemory>
  ) { }
}


export class Hauler extends BaseCreep {
  constructor(budget: number, memory: HaulerMemory) {
    super(CreepTypes.hauler, [ CARRY, MOVE ], budget, memory);
  }
}

export class HaulerCreepExecutor extends CreepExecutor<HaulerCreep> {
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

  run() {
    this.creep.memory.state ??= COLLECT_STATE;
    this._checkState.check(this.creep);

    if (this.creep.isDelivering) {
      /*
        const destination = Game.rooms[creep.memory.room].logisticsManager.getDeliveryDestination(this.creep);
        return this.creep.tryDeliver({ destination });
      */

      const dropOffPos = PosUtils.new(this.creep.memory.dropOffPos);
      const targetId = this.creep.memory.targetId;

      if (dropOffPos && !targetId) {
        const room = Game.rooms[dropOffPos.roomName];
        const spawn = room.owned?.state.spawn;

        if (spawn) {
          const deliverToSpawn = spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 || spawn.hasSpawnRequests;
          if (deliverToSpawn) return this.creep.tryDeliver({ pos: spawn.pos, targetId: spawn.id });
        }

        const extensions = room.owned?.state.structureState.getExtensions().filter(x => !!x.store.getFreeCapacity());
        if (!!extensions?.length) return this.creep.tryDeliver({ pos: extensions[0].pos, targetId: extensions[0].id });

        const stationaryBuilders = room.owned?.state.taskState.getAllocatedDrones(TaskTypes.stationaryBuild).filter(x => x.store.getFreeCapacity(RESOURCE_ENERGY) > 25);
        if (!!stationaryBuilders?.length) {

          return this.creep.tryTransfer({ target: stationaryBuilders[0] });
        }

        const stationaryUpgraders = room.owned?.state.taskState.getAllocatedDrones(TaskTypes.stationaryUpgrade).filter(x => x.store.getFreeCapacity(RESOURCE_ENERGY) > 25);
        if (!!stationaryUpgraders?.length) return this.creep.tryTransfer({ target: stationaryUpgraders[0] });
      }

      if (dropOffPos && targetId) return this.creep.tryDeliver({
        pos: dropOffPos,
        targetId: this.creep.memory.targetId
      });
    }

    if (this.creep.isCollecting) {
      const collectPos = this.creep.memory.collectPos;
      return this.creep.tryCollect({ pos: collectPos });
    }

    return;
  }
}

CreepExecutorLoader.register(CreepTypes.hauler, HaulerCreepExecutor);
