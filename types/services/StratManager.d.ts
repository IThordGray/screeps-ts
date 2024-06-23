interface ICreepRequirement {
  creepType: CreepType;
  budget: number;
  memory?: Record<string, any> | undefined;
}

interface IRequirements {
  get creepNeeds(): ICreepRequirement[];

  get taskNeeds(): ITask[];

  // get structureNeeds(): IStructureNeeds[];
  // get controllerNeeds(): IControllerNeeds;
}

interface IStrat extends IRequirements {
  getStatus(): Record<string, any>;

  update(): void;
}

interface IStratManager {
  getCurrentStrat(): IStrat;

  update(): void;
}