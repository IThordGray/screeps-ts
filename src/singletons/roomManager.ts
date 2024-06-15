class RoomManager {
  run(room: Room): void {
    room.owned.constructionManager.update(); // place any new constructions sites based on the building plans
    room.owned.stratManager.update(); // updates the current strat based on the current room state
    room.owned.spawner.update();

    room.owned.constructionManager.run(); // place any new constructions sites based on the building plans
    room.owned.spawner.run(); // using the creep requirements from the current strat
    room.owned.taskDistributor.run(); // using the tasks from the current strat, assign the tasks to the creeps based on priority
    room.owned.creepManager.run(); // run each creep assigned to the current room

    room.owned.dashboard.render();
  }
}

export const roomManager = new RoomManager();