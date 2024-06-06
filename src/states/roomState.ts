import { gameState } from "../singletons/gameState";
import { ConstructionState } from "./constructionState";
import { CreepState } from "./creepState";
import { ResourceState } from "./resourceState";
import { StructureState } from "./structureState";

export class RoomState {

  private _sources!: { source: Source, distance: number, hasNearbyHostiles: boolean }[];
  readonly spawn: StructureSpawn;
  readonly controller: StructureController;

  readonly structureState: StructureState;
  readonly constructionState: ConstructionState;
  readonly creepState: CreepState;
  readonly resourceState: ResourceState;

  get room() {
    return Game.rooms[this._roomName];
  }

  constructor(
    private readonly _roomName: string
  ) {
    this.spawn = Game.rooms[this._roomName]?.find(FIND_MY_SPAWNS)![0];
    this.controller = Game.rooms[this._roomName]?.controller!;

    this.structureState = new StructureState(this.room);
    this.constructionState = new ConstructionState(this.room);
    this.creepState = new CreepState(this.room);
    this.resourceState = new ResourceState(this.room, this.spawn);
  }

  getSources(args: { excludeHostiles?: boolean } = {}) {
    if (!!this._sources) {
      if (args.excludeHostiles) return this._sources.filter(x => !x.hasNearbyHostiles);
      return this._sources;
    }

    const sources = this.spawn.room.find(FIND_SOURCES);

    // Calculate the distance from the spawn to each source
    const sourcesWithDistance = sources.map(source => {
      const path = PathFinder.search(this.spawn.pos, { pos: source.pos, range: 1 });
      const hasNearbyHostiles = !!source.pos.findInRange(FIND_HOSTILE_SPAWNS, 5).length || !!source.pos.findInRange(FIND_HOSTILE_CREEPS, 5).length;
      return { source: source, distance: path.cost, hasNearbyHostiles };
    });

    sourcesWithDistance.sort((a, b) => a.distance - b.distance);

    this._sources = sourcesWithDistance;

    if (args.excludeHostiles) return this._sources.filter(x => !x.hasNearbyHostiles);
    return this._sources;
  }
}