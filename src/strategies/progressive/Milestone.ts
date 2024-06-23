import { StratConfig } from "./ProgressiveStrat";

export abstract class Milestone {
  protected _room: Room;
  protected _stratConfig: StratConfig;

  constructor(room: Room, config: StratConfig) {
    this._room = room;
    this._stratConfig = config;

    this.init();
  }

  abstract init(): void
}