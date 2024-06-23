export class CreepState {
  private _creepTypes: { [creepType: string]: Creep[] } = {};

  readonly getCreepCount = (creepType: CreepType) => this._creepTypes[creepType]?.length ?? 0;
  readonly getCreeps = (creepType: CreepType) => this._creepTypes[creepType] ?? [];

  constructor(
    public readonly room: Room
  ) { }

  add(creep: Creep) {
    const { role } = creep.memory;
    this._creepTypes[role] ??= [];
    this._creepTypes[role].push(creep);
  }
}