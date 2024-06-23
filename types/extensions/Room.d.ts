type RemoteOptions = { pos: RoomPosition };

interface Room {
  owned: {
    state: IRoomState;
    constructionManager: IConstructionManager;
    stratManager: IStratManager;
    spawner: ISpawner;
    taskDistributor: ITaskDistributor;
    creepManager: ICreepManager;
    dashboard: IDashboard;
  };
}