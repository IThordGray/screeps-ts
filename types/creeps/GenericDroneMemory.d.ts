type GenericDroneMemory = CreepMemory & {
  task: ITask;
};

type GenericDroneCreep = Creep & {
  memory: GenericDroneMemory;
}