declare const TTaskTypes: {
  defend: "defend",
  harvest: "harvest",
  haul: "haul",
  build: "build",
  repair: "repair",
  scout: "scout",
  upgrade: "upgrade"
};

type TaskType = typeof TTaskTypes[keyof typeof TTaskTypes];
