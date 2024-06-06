import { RoomState } from "../states/roomState";

export const BuildingTypes = {
  extension: "extension" as BuildableStructureConstant,
  road: "road" as BuildableStructureConstant,
  spawn: "spawn" as BuildableStructureConstant,
  tower: "tower" as BuildableStructureConstant,
  storage: "storage" as BuildableStructureConstant
};

export type BuildingType = typeof BuildingTypes[keyof typeof BuildingTypes];

export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
  }
}

export class BuildingPlan {
  constructor(
    public readonly buildingType: BuildableStructureConstant,
    public readonly offsets: Vector2[]
  ) {
  }

  place(room: Room, origin: Vector2) {
    for (const offset of this.offsets) {
      const x = origin.x + offset.x;
      const y = origin.y + offset.y;
      room.createConstructionSite(x, y, this.buildingType);
    }
  }
}

export class BuildPlannerConfig {
  readonly buildingPlans: BuildingPlan[] = [];
  readonly origin: RoomPosition;

  constructor(origin: RoomPosition) {
    this.origin = origin;
  }

  static extensionStamp(centralOffSet: Vector2) {
    return {
      [BuildingTypes.extension]: [
        new Vector2(centralOffSet.x, centralOffSet.y),
        new Vector2(centralOffSet.x, centralOffSet.y - 1),
        new Vector2(centralOffSet.x + 1, centralOffSet.y),
        new Vector2(centralOffSet.x, centralOffSet.y + 1),
        new Vector2(centralOffSet.x - 1, centralOffSet.y)
      ],
      [BuildingTypes.road]: [
        new Vector2(centralOffSet.x, centralOffSet.y - 2),
        new Vector2(centralOffSet.x + 1, centralOffSet.y - 1),
        new Vector2(centralOffSet.x + 2, centralOffSet.y),
        new Vector2(centralOffSet.x + 1, centralOffSet.y + 1),
        new Vector2(centralOffSet.x, centralOffSet.y + 2),
        new Vector2(centralOffSet.x - 1, centralOffSet.y + 1),
        new Vector2(centralOffSet.x - 2, centralOffSet.y - 1)
      ]
    };
  }

  addExtensions(...offsets: Vector2[]): this {
    this.buildingPlans.push(new BuildingPlan(BuildingTypes.extension, offsets));
    return this;
  }

  addRoads(...offsets: Vector2[]): this {
    this.buildingPlans.push(new BuildingPlan(BuildingTypes.road, offsets));
    return this;
  }

  addSpawn(offset: Vector2): this {
    this.buildingPlans.push(new BuildingPlan(BuildingTypes.spawn, [ offset ]));
    return this;
  }

  addStorage(offset: Vector2): this {
    this.buildingPlans.push(new BuildingPlan(BuildingTypes.storage, [ offset ]));
    return this;
  }

  addTowers(...offsets: Vector2[]): this {
    this.buildingPlans.push(new BuildingPlan(BuildingTypes.tower, offsets));
    return this;
  }
}

export class BuildPlanner {
  private _currentIndex = 0;

  constructor(
    private readonly _room: Room,
    private _config?: BuildPlannerConfig | undefined
  ) {
  }

  placeNext() {
    if (!this._config) return;
    if (this._currentIndex === this._config.buildingPlans.length) return;
    const currentPlans = this._config.buildingPlans[this._currentIndex++];
    currentPlans?.place(this._room, this._config.origin);
  }

  setConfig(config: BuildPlannerConfig | undefined) {
    const roomState = this._room.owned.state;
    this._config = config;
    this._currentIndex = 0;

    if (!config) return;

    const currentStructureState: { [structureType: string]: number } = {};

    for (const buildingPlan of config.buildingPlans) {
      const { buildingType, offsets } = buildingPlan;

      currentStructureState[buildingType] ??= 0;
      currentStructureState[buildingType] += offsets.length;

      const structures = roomState.structureState.getStructures(buildingType);
      if (structures?.length === currentStructureState[buildingType]) this._currentIndex++;
    }
  }
}