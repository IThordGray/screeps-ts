import { RoomState } from "../states/roomState";
import { ProgressiveStrat } from "../strategies/progressive/progressive.strat";
import { TaskAllocator } from "../tasking/taskAllocator";

export const StratLoader = [
  (room: Room, taskAllocator: ITaskAllocator) => new ProgressiveStrat(room, taskAllocator)
];

/**
 * Keeps a list of all the strats. During the update call, decides which strat is needed.
 * During this run call, invokes the current strat.
 */
export class StratManager implements IStratManager {

  private readonly _roomState = this._room.owned.state;

  private readonly _currentStrat: IStrat;

  private get taskAllocator() { return this._room.owned.taskAllocator }

  constructor(
    private readonly _room: Room
  ) {

    const progressiveStrat = StratLoader[0];
    this._currentStrat = progressiveStrat(this._room, this.taskAllocator);
  }

  getCurrentStrat(): IStrat {
    return this._currentStrat;
  }

  update() {
    // The strat needs to return what to build next and what the tasks should look like.
    this._currentStrat.update();
  }

}