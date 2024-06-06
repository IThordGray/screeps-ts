import { EventTypes } from "../abstractions/event-types";
import { Logger } from "../helpers/logger";
import { RoomState } from "../states/roomState";
import { eventBus } from "./eventBus";

export class ScoutedRoomState {
  controllerId: Id<StructureController> | undefined;
  sourceIds: Id<Source>[] = [];
}

class GameState {

  private readonly _onCreepSpawn = (creep: Creep) => Logger.success(`Creep spawned: ${ creep.name }`);
  private readonly _onCreepDeath = (creep: Creep) => Logger.warn(`Creep died: ${ creep.name }`);
  private readonly _onMilestoneActivated = ({ name }: any) => Logger.info(`Milestone activated: ${ name }`);
  private readonly _onControllerUpgraded = ({ level, tick }: {
    level: number,
    tick: number
  }) => Logger.info(`Controller upgraded to ${ level } at ${ tick }`);

  roomStates: { [roomName: string]: RoomState } = {};

  constructor() {
    eventBus.on(EventTypes.creepSpawned, this._onCreepSpawn.bind(this));
    eventBus.on(EventTypes.creepDied, this._onCreepDeath.bind(this));
    eventBus.on(EventTypes.milestoneActivated, this._onMilestoneActivated.bind(this));
    eventBus.on(EventTypes.controllerUpgraded, this._onControllerUpgraded.bind(this));
  }

  update() {
    this.roomStates = {};

    _.forEach(Game.creeps, creep => {
      const room = creep.memory.room;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].creepState.add(creep);
    });

    _.forEach(Game.structures, structure => {
      const room = structure.room.name;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].structureState.add(structure);
    });

    _.forEach(Game.constructionSites, constructionSite => {
      const room = constructionSite.room?.name;
      if (!room) return;
      this.roomStates[room] ??= new RoomState(room);
      this.roomStates[room].constructionState.add(constructionSite);
    });
  }
}

export const gameState = new GameState();
