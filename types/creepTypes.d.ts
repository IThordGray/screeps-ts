declare const TCreepTypes: {
  miner: "miner";
  hauler: "hauler";
  scout: "scout";
  genericDrone: "drone";
};

type CreepType = typeof TCreepTypes[keyof typeof TCreepTypes];
