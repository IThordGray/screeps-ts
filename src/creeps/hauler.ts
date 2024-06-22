import { CreepTypes } from "../abstractions/creep-types";
import { BaseCreep } from "../classes/base-creep";
import { COLLECT_STATE, collectStateSwitchAction } from "../extensions/creeps/creep-try-collect.extensions";
import { DELIVER_STATE, deliverStateSwitchAction } from "../extensions/creeps/creep-try-deliver.extensions";
import { findOptimalClusterPosition } from "../helpers/find-cluster-position.helper";
import { UpgraderDrone } from "../tasking/tasks/upgrade.task";
import { TaskTypes } from "../tasking/taskTypes";
import { CheckState } from "../units-of-work/check-state";
import { PosUtils } from "../utils/pos.utils";

export function isHaulerMemory(memory: CreepMemory): memory is HaulerMemory {
  return memory.role === CreepTypes.hauler;
}

export interface HaulerMemory extends CreepMemory {
  role: "hauler";
  sourceId: Id<Source>;
  targetId?: Id<AnyCreep> | Id<Structure>;
  collectPos?: RoomPosition;
  dropOffPos?: RoomPosition;
}

export type Hauler = Creep & { memory: HaulerMemory };

class HaulerCreep extends BaseCreep {

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

  override readonly role = CreepTypes.hauler;
  override readonly bodyParts = [ CARRY, MOVE ];

  need(budget: number, memory: Partial<HaulerMemory>) {
    return {
      creepType: CreepTypes.hauler,
      budget,
      memory
    };
  }

  run(creep: Hauler) {
    creep.memory.state ??= COLLECT_STATE;
    this._checkState.check(creep);

    if (creep.isDelivering) {
      const dropOffPos = PosUtils.new(creep.memory.dropOffPos);
      const targetId = creep.memory.targetId;

      if (dropOffPos && !targetId) {
        const room = Game.rooms[dropOffPos.roomName];
        const spawn = room.owned?.state.spawn;

        if (spawn) {
          const deliverToSpawn = spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 || spawn.hasSpawnRequests;
          if (deliverToSpawn) return creep.tryDeliver({ pos: spawn.pos, targetId: spawn.id });
        }

        const extensions = room.owned?.state.structureState.getExtensions().filter(x => !!x.store.getFreeCapacity());
        if (!!extensions?.length) return creep.tryDeliver({ pos: extensions[0].pos, targetId: extensions[0].id });

        const stationaryBuilders = room.owned?.state.taskState.getAllocatedDrones(TaskTypes.stationaryBuild).filter(x => x.store.getFreeCapacity(RESOURCE_ENERGY) > 25);
        if (!!stationaryBuilders?.length) return creep.tryTransfer({ target: stationaryBuilders[0] });

        const stationaryUpgraders = room.owned?.state.taskState.getAllocatedDrones(TaskTypes.stationaryUpgrade).filter(x => x.store.getFreeCapacity(RESOURCE_ENERGY) > 25);
        if (!!stationaryUpgraders?.length) return creep.tryTransfer({ target: stationaryUpgraders[0] });
      }

      if (dropOffPos && targetId) return creep.tryDeliver({ pos: dropOffPos, targetId: creep.memory.targetId });
    }

    if (creep.isCollecting) {
      const collectPos = creep.memory.collectPos;
      return creep.tryCollect({ pos: collectPos });
    }

    return;
  }
}

export const haulerCreep = new HaulerCreep();
