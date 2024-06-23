declare const TCreepTypes: {
  miner: "miner";
  hauler: "hauler";
  scout: "scout";
  genericDrone: "drone";
};

type MINER = "miner";
type HAULER = "hauler";
type SCOUT = "scout";
type GENERIC_DRONE = "genericDrone";

type CreepType = typeof TCreepTypes[keyof typeof TCreepTypes];
