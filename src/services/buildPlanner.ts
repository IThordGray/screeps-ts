export const BuildingTypes = {
  extension: "extension" as BuildableStructureConstant,
  road: "road" as BuildableStructureConstant,
  spawn: "spawn" as BuildableStructureConstant,
  tower: "tower" as BuildableStructureConstant,
  storage: "storage" as BuildableStructureConstant
};

export type BuildingType = typeof BuildingTypes[keyof typeof BuildingTypes];
