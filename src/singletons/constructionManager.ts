import { BlueprintRCL2, BlueprintRCL3, BlueprintRCL4, BlueprintRCL5 } from "../building-plans/blueprints";
import { Vector2 } from "./buildPlanner";

export class ConstructionManager implements IConstructionManager {

  private readonly _blueprints: Record<number, Array<{ structure: StructureConstant, pos: Vector2 }>> = {
    2: [ ...BlueprintRCL2 ],
    3: [ ...BlueprintRCL2, ...BlueprintRCL3 ],
    4: [ ...BlueprintRCL2, ...BlueprintRCL3, ...BlueprintRCL4 ],
    5: [ ...BlueprintRCL2, ...BlueprintRCL3, ...BlueprintRCL4, ...BlueprintRCL5 ]
  };

  constructor(
    readonly _room: Room
  ) { }

  run() {
    if (!this._room.owned.state.controller) return;
    const controllerLevel = this._room.owned.state.controller.level;

    const currentBlueprint = this._blueprints[controllerLevel];
    if (!currentBlueprint) return;

    const { x, y } = this._room.owned.state.spawn?.pos ?? { x: 25, y: 25 };
    const getRoomPosition = (offset: Vector2) => new RoomPosition(x + offset.x, y + offset.y, this._room.name);
    for (const plan of currentBlueprint) {
      const pos = getRoomPosition(plan.pos);
      const lookResults = pos.look();
      if (lookResults.some(x => x.structure?.structureType === plan.structure)) continue;
      if (lookResults.some(x => !!x.constructionSite)) return;
      pos.createConstructionSite(plan.structure as BuildableStructureConstant);
      return;
    }
  }
}