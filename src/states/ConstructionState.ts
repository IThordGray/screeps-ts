export class ConstructionState {
  private _constructionSites: { [constructionSiteId: string]: ConstructionSite } = {};

  getConstructionSites = () => Object.values(this._constructionSites);

  constructor(
    public readonly room: Room
  ) { }

  add(constructionSite: ConstructionSite) {
    this._constructionSites[constructionSite.id] = constructionSite;
  }
}