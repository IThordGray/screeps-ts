import { IStrat } from "../abstractions/interfaces";
import { ProgressiveStrat } from "../strategies/progressive/progressive.strat";
import { TaskAllocator } from "../tasking/taskAllocator";
import { RoomState } from "./game-state";

export const StratLoader = [
  (room: Room, taskAllocator: TaskAllocator) => new ProgressiveStrat(room, taskAllocator)
];

/**
 * Keeps a list of all the strats. During the update call, decides which strat is needed.
 * During this run call, invokes the current strat.
 */
export class StratManager {

  private readonly _roomState = RoomState.get(this._room.name);

  private _currentStrat: IStrat;

  constructor(
    private readonly _room: Room,
    private readonly _taskAllocator: TaskAllocator
  ) {

    const progressiveStrat = StratLoader[0];
    this._currentStrat = progressiveStrat(this._room, this._taskAllocator);
  }

  getCurrentStrat(): IStrat {
    return this._currentStrat;
  }

  update() {
    // The strat needs to return what to build next and what the tasks should look like.
    this._currentStrat.update();
  }
}