import { ProgressiveStrat } from "../strategies/progressive/ProgressiveStrat";

export const StratLoader = [
  (room: Room) => new ProgressiveStrat(room)
];

/**
 * Keeps a list of all the strats. During the update call, decides which strat is needed.
 * During this run call, invokes the current strat.
 */
export class StratManager implements IStratManager {

  private readonly _currentStrat: IStrat;

  constructor(
    private readonly _room: Room
  ) {

    const progressiveStrat = StratLoader[0];
    this._currentStrat = progressiveStrat(this._room);
  }

  getCurrentStrat(): IStrat {
    return this._currentStrat;
  }

  update() {
    // The strat needs to return what to build next and what the tasks should look like.
    this._currentStrat.update();
  }

}