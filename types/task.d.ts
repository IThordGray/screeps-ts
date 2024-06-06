interface ITaskDistributor {
  run(): void;
}

interface ITaskAllocator {
  getAllocatedDrones(taskType?: any): any;

  getUnallocatedDrones(): any;

  update(): void;
}

interface ITask {
  type: any;
  id: string;
  priority: any;
  pos: RoomPosition;
}