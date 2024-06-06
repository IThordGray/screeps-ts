export class ResourceState {
  private readonly _sources: { [sourceId: string]: Source } = {};
  private readonly _sourceDistanceFromSource: { [sourceId: string]: number } = {};
  private readonly _sourcesNearHostiles: { [sourceId: string]: boolean } = {};

  readonly getSources = () => {
    const sources = Object.values(this._sources).filter(x => !this._sourcesNearHostiles[x.id]);
    return sources.sort((a, b) => this._sourceDistanceFromSource[a.id] - this._sourceDistanceFromSource[b.id]);
  }

  constructor(
    public readonly room: Room,
    public readonly spawn?: StructureSpawn
  ) {
    // console.log(this.room);
    const sources = this.room.find(FIND_SOURCES);
    sources.forEach(source => {
      this._sources[source.id] = source;

      this._sourcesNearHostiles[source.id] =
        !!source.pos.findInRange(FIND_HOSTILE_SPAWNS, 5).length ||
        !!source.pos.findInRange(FIND_HOSTILE_CREEPS, 5).length;

      this._sourceDistanceFromSource[source.id] = !!this.spawn
        ? PathFinder.search(this.spawn.pos, { pos: source.pos, range: 1 }).cost
        : 99;
    });
  }
}