import { EventTypes } from "../abstractions/eventTypes";
import { RoomState } from "../states/roomState";
import { TaskAllocator } from "../tasking/taskAllocator";
import { TaskDistributor } from "../tasking/taskDistributor";
import { BuildPlanner } from "./buildPlanner";
import { ConstructionManager } from "./constructionManager";
import { CreepManager } from "./creepManager";
import { eventBus } from "./eventBus";
import { Spawner } from "./spawner";
import { StratManager } from "./stratManager";

export interface IRoomContext {
  roomState: RoomState;
  taskAllocator: TaskAllocator;
}

export class RoomInstance {

  private readonly _stratManager: StratManager;
  private readonly _taskAllocator: TaskAllocator;
  private readonly _taskDistributor: TaskDistributor;
  private readonly _spawner: Spawner;
  private readonly _creepManger: CreepManager;
  private readonly _constructionManager: ConstructionManager;
  private readonly _buildPlanner: BuildPlanner;
  private readonly _room: Room;

  constructor(room: string) {
    this._room = Game.rooms[room];

    if (!Memory.rooms || !Memory.rooms[room]) {
      Memory.rooms = { [room]: {
        name: this._room.name,
        controllerLevel: this._room.controller?.level
      }}
    }

    this._buildPlanner = new BuildPlanner(this._room);
    this._constructionManager = new ConstructionManager(this._room);
    this._taskAllocator = new TaskAllocator(this._room);
    this._stratManager = new StratManager(this._room);

    this._taskDistributor = new TaskDistributor(this._room);
    this._spawner = new Spawner(this._room);
    this._creepManger = new CreepManager(this._room);
  }

  private checkControllerLevel() {
    const controllerLevel = Memory.rooms?.[this._room.name]?.controllerLevel ?? 1;
    if (this._room.controller?.level !== controllerLevel) {
      eventBus.emit(EventTypes.controllerUpgraded, { level: this._room.controller?.level, time: Game.time });
    }

    Memory.rooms[this._room.name] ??= {} as any;
    Memory.rooms[this._room.name].controllerLevel = this._room.controller?.level;
  }

  run() {
    this.checkControllerLevel();

    this._constructionManager.update(); // place any new constructions sites based on the building plans
    // this._taskAllocator.update(); // update the state of the room's current drones and their respective tasks
    this._stratManager.update(); // updates the current strat based on the current room state
    this._spawner.update();

    this._constructionManager.run(); // place any new constructions sites based on the building plans
    this._spawner.run(); // using the creep requirements from the current strat
    this._taskDistributor.run(); // using the tasks from the current strat, assign the tasks to the creeps based on priority
    this._creepManger.run(); // run each creep assigned to the current room
  }
}