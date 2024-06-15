type IConstructionState = {
  getConstructionSites: () => ConstructionSite[]
};

type ICreepState = {
  getCreepCount: (creepType: CreepType) => number;
  getCreeps: (creepType: CreepType) => Creep[];
};

type IResourceState = {
  getSources: () => Source[];
};

type IStructureState = {
  getExtensions: () => StructureExtension[];
  getRoads: () => StructureRoad[];
  getContainers: () => StructureContainer[];
  getStructures: (buildingType: any) => any;
};

interface ITaskState {
  getAllocatedDrones: (taskType?: TaskType) => Creep[];
  getUnallocatedDrones: () => Creep[];
}

interface IRoomState {
  spawn?: StructureSpawn;
  controller?: StructureController;
  constructionState: IConstructionState;
  creepState: ICreepState;
  resourceState: IResourceState;
  structureState: IStructureState;
  taskState: ITaskState;
}