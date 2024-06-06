type RemoteOptions = { pos: RoomPosition };

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

interface IBuildPlanner {
  placeNext(): void;

  setConfig(config: any): void;
}

interface Room {
  owned: {
    state: IRoomState;
    buildPlanner: IBuildPlanner;
    constructionManager: IConstructionManager;
    taskAllocator: ITaskAllocator;
    stratManager: IStratManager;
    spawner: ISpawner;
    taskDistributor: ITaskDistributor;
    creepManager: ICreepManager;
  };
}