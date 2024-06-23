import { BuildingType } from "../services/buildPlanner";

export class StructureState {
  private _extensions: { [extensionId: string]: StructureExtension } = {};
  private _roads: { [roadId: string]: StructureRoad } = {};
  private _containers: { [containerId: string]: StructureContainer } = {};

  readonly getExtensions = () => Object.values(this._extensions);
  readonly getRoads = () => Object.values(this._roads);
  readonly getContainers = () => Object.values(this._containers);

  readonly getStructures = (structureType: BuildingType) => {
    if (structureType === "road") return this.getRoads();
    if (structureType === "extension") return this.getExtensions();
    if (structureType === "container") return this.getContainers();
    return undefined;
  }

  constructor(
    public readonly room: Room
  ) {
  }

  add(structure: Structure) {
    if (structure.structureType === "extension") this._extensions[structure.id] = structure as StructureExtension;
    if (structure.structureType === "road") this._roads[structure.id] = structure as StructureRoad;
    if (structure.structureType === "container") this._containers[structure.id] = structure as StructureContainer;
  }
}