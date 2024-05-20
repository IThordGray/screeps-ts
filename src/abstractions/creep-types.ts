export const CreepTypes = {
  miner: "miner",
  hauler: "hauler",
  scout: "scout",
  ldh: "ldh",
  genericDrone: "drone",
  harvester: "harvester"
};

export type CreepType = typeof CreepTypes[keyof typeof CreepTypes];
