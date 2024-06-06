import { rcl2 } from "../building-plans/RCL2";
import { RoomState } from "../states/roomState";
import { BuildPlanner } from "./buildPlanner";

export class ConstructionManager implements IConstructionManager {

  private get buildPlanner() { return this._room.owned.buildPlanner }

  constructor(
    readonly _room: Room
  ) { }

  private getConfigForLevel(level: number) {
    if (!this._room.owned.state.spawn) return;
    if (level === 2) return rcl2(this._room.owned.state.spawn.pos);
    return undefined;
  }

  update() {
    if (!this._room.owned.state.controller) return;
    const controllerLevel = this._room.owned.state.controller.level;
    const config = this.getConfigForLevel(controllerLevel);
    this.buildPlanner.setConfig(config);
  }

  run() {
    const constructionSites = this._room.owned.state.constructionState.getConstructionSites();
    if (!constructionSites.length) this.buildPlanner.placeNext();
  }
}