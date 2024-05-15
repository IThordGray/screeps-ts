import { CreepTypes } from "abstractions/creep-types";
import { BaseCreep } from "classes/base-creep";
import { taskDistributor } from "singletons/task-distributor";
import { Withdraw } from "units-of-work/withdraw";
import { CheckState } from "../units-of-work/check-state";
import { Work } from "../units-of-work/work";

export function isDroneMemory(memory: CreepMemory): memory is DroneMemory {
  return memory.role === CreepTypes.drone;
}

export interface DroneMemory extends CreepMemory {
  role: "drone";
  taskId?: string;
}

class DroneCreep extends BaseCreep {
  private readonly _checkState = new CheckState({
    [Withdraw.state]: {
      condition: creep => creep.memory.state === Work.state && creep.store.getFreeCapacity() === 0,
      action: creep => Withdraw.action(creep)
    },
    [Work.state]: {
      condition: creep => creep.memory.state === Withdraw.state && creep.store.getUsedCapacity() === 0,
      action: creep => Work.action(creep)
    }
  });

  private readonly _withdraw = new Withdraw({
    getTarget: (creep: Creep) => creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (
        s.structureType === STRUCTURE_CONTAINER ||
        s.structureType === STRUCTURE_STORAGE ||
        s.structureType === STRUCTURE_SPAWN ||
        s.structureType === STRUCTURE_EXTENSION &&
        s.store.getUsedCapacity(RESOURCE_ENERGY) > 50
      )
    })
  });

  override readonly role: string = CreepTypes.drone;
  override readonly bodyParts: BodyPartConstant[] = [ WORK, CARRY, MOVE ];

  private doBuild(creep: Creep) {
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (!target) return;

    const code = creep.build(target);
    if (code === ERR_NOT_IN_RANGE) return creep.moveTo(target);
    return code;
  }

  private doRepair(creep: Creep) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });
    if (!target) return ERR_NOT_FOUND;
    const code = creep.repair(target);
    if (code === ERR_NOT_IN_RANGE) return creep.moveTo(target);
    return code;
  }

  private doUpgrade(creep: Creep) {
    const target = creep.room.controller;
    if (!target) return;

    const code = creep.upgradeController(target);
    if (code === ERR_NOT_IN_RANGE) return creep.moveTo(target);
    return code;
  }

  private doWork(creep: Creep) {
    // Drones are general workers. They pick up priority general tasks from the task distributor.
    // If there are no general tasks available, they do the following in this order:
    // - repair
    // - build
    // - upgrade
    this.doRepair(creep) === OK;
    this.doBuild(creep) === OK;
    this.doUpgrade(creep) === OK;
  }

  private getCreepTask(creep: Creep) {
    if (!isDroneMemory(creep.memory)) return;
    if (!creep.memory.taskId) return;
    return taskDistributor.getCreepTask(creep.memory.taskId);
  }

  run(creep: Creep): void {
    const currentTask = this.getCreepTask(creep);
    if (currentTask) return currentTask.run(creep);

    creep.memory.state ??= Work.state;
    this._checkState.check(creep);

    if (creep.memory.state === Withdraw.state) this._withdraw.run(creep);
    if (creep.memory.state === Work.state) this.doWork(creep);
  }

}

export const droneCreep = new DroneCreep();
