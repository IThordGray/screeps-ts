import { BuildingTypes, BuildPlannerConfig, Vector2 } from "../singletons/buildPlanner";

export const rcl2 = (origin: RoomPosition) => {
  const {
    [BuildingTypes.extension]: extensions,
    [BuildingTypes.road]: roads
  } = BuildPlannerConfig.extensionStamp(new Vector2(4, 0));

  const config = new BuildPlannerConfig(origin);

  extensions.forEach(e => config.addExtensions(e));
  roads.forEach(r => config.addRoads(r));

  return config;
};



