import { TaskAllocator } from "../tasking/taskAllocator";
import { TaskDistributor } from "../tasking/taskDistributor";
import { CreepManager } from "./creep.manager";
import { Spawner } from "./spawner";
import { StratManager } from "./strat-manager";

export class RoomInstance {

  private readonly _stratManager: StratManager;
  private readonly _taskAllocator: TaskAllocator;
  private readonly _taskDistributor: TaskDistributor;
  private readonly _spawner: Spawner;
  private readonly _creepManger: CreepManager;
  private readonly _room: Room;

  constructor(room: string) {
    this._room = Game.rooms[room];
    this._taskAllocator = new TaskAllocator(this._room);
    this._stratManager = new StratManager(this._room, this._taskAllocator);

    this._taskDistributor = new TaskDistributor(this._room, this._taskAllocator, this._stratManager);
    this._spawner = new Spawner(room, this._stratManager);
    this._creepManger = new CreepManager(this._room);
  }

  run() {
    this._taskAllocator.update(); // update the state of the room's current drones and their respective tasks
    this._stratManager.update(); // updates the current strat based on the current room state
    this._spawner.update();

    this._spawner.run(); // using the creep requirements from the current strat
    this._taskDistributor.run(); // using the tasks from the current strat, assign the tasks to the creeps based on priority
    this._creepManger.run(); // run each creep assigned to the current room
  }
}