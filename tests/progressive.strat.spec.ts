import { mockGlobal, mockInstanceOf } from "screeps-jest";
import { Logger } from "../src/helpers/logger";
import { Milestone } from "../src/strategies/progressive/Milestone";
import { ProgressiveStrat, StratConfig } from "../src/strategies/progressive/ProgressiveStrat";
import { StratCondition } from "../src/strategies/progressive/StratCondition";
import { TaskAllocator } from "../src/tasking/taskAllocator";
import spyOn = jest.spyOn;

const myController = mockInstanceOf<StructureController>({ my: true, level: 1 });
const myRoom = mockInstanceOf<Room>({ controller: myController, name: "myRoom", find: () => [] });
spyOn(Logger, "info").mockImplementation(() => {
});

mockGlobal("Game", {
  creeps: {},
  rooms: { myRoom },
  time: 1
}, true);

mockGlobal("Memory", {
  rooms: { myRoom: {} }
}, true);

class Milestone1 extends Milestone {
  init(): void {
  }
}

class Milestone2 extends Milestone {
  init(): void {
  }
}

class Milestone3 extends Milestone {
  init(): void {
  }
}

describe("ProgressiveStrat", () => {
  let strat: ProgressiveStrat;
  let taskAllocator = new TaskAllocator(myRoom);
  let config: StratConfig;

  beforeEach(() => {
    Game.creeps = {};
    Game.rooms = { myRoom };
    Game.time = 1;

    Memory.rooms = { myRoom: {} };

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    config = (strat as any)._config;
  });

  afterEach(() => {

  });

  it("should instantiate the next milestone if all conditions are satisfied", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config),
      () => new Milestone2(myRoom.name, taskAllocator, config)
    ];

    jest.spyOn(Milestone1.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => true, () => ({})),
        new StratCondition(() => true, () => ({})),
        new StratCondition(() => true, () => ({}))
      ];
    });

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    strat.update();
    strat.update();
    strat.update();
    strat.update();
    strat.update();
    const loadedMilestones = (strat as any)._loadedMilestones;

    expect(loadedMilestones.length).toBe(2);
    expect(loadedMilestones[0].constructor.name).toBe("Milestone1");
    expect(Memory.rooms.myRoom.stratManager!.currentMilestone).toBe("Milestone2");
  });

  it("should not instantiate a milestone if any condition is not satisfied", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config),
      () => new Milestone2(myRoom.name, taskAllocator, config)
    ];

    jest.spyOn(Milestone1.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => true, () => ({})),
        new StratCondition(() => false, () => ({})),
        new StratCondition(() => true, () => ({}))
      ];
    });

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    config = (strat as any)._config;

    strat.update();
    strat.update();
    strat.update();
    strat.update();
    strat.update();
    const loadedMilestones = (strat as any)._loadedMilestones;

    expect(loadedMilestones.length).toBe(1);

    expect(Memory.rooms.myRoom.stratManager!.currentMilestone).toBe("Milestone1");
  });

  it("should not instantiate a milestone if there are no more milestones", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [];

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    strat.update();
    strat.update();
    strat.update();
    strat.update();
    strat.update();
    const loadedMilestones = (strat as any)._loadedMilestones;

    expect(loadedMilestones.length).toBe(0);

    expect(Memory.rooms.myRoom.stratManager?.currentMilestone).toBeUndefined();
  });

  it("should call the action of the first unsatisfied condition", () => {
    const action = jest.fn().mockReturnValue({ tasks: { tasks: [] }, creeps: { creeps: [] } });

    jest.spyOn(Milestone1.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => false, action)
      ];
    });

    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config)
    ];

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    config = (strat as any)._config;

    strat.update();
    strat.update();
    strat.update();
    strat.update();
    strat.update();

    expect(action).toHaveBeenCalled();
    expect(strat.taskNeeds).toEqual([]);
    expect(strat.creepNeeds).toEqual([]);
  });

  it("should set task and creep requirements based on the action needs", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config)
    ];

    const action = jest.fn().mockReturnValue({
      tasks: { tasks: [ "task1", "task2" ] },
      creeps: { creeps: [ "creep1", "creep2" ] }
    });

    jest.spyOn(Milestone1.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => false, action)
      ];
    });

    strat = new ProgressiveStrat(myRoom, taskAllocator);
    config = (strat as any)._config;

    strat.update();
    strat.update();
    strat.update();
    strat.update();
    strat.update();

    expect(strat.taskNeeds).toEqual([ "task1", "task2" ]);
    expect(strat.creepNeeds).toEqual([ "creep1", "creep2" ]);
  });

  it("should load the milestones on a global reset, based on the current memory", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config),
      () => new Milestone2(myRoom.name, taskAllocator, config),
      () => new Milestone3(myRoom.name, taskAllocator, config)
    ];

    Memory.rooms.myRoom.stratManager = {
      currentMilestone: "Milestone2"
    };

    const _strat = new ProgressiveStrat(myRoom, taskAllocator);
    const loadedMilestones = (_strat as any)._loadedMilestones;

    expect((_strat as any)._milestones.length).toBe(1);
    expect(loadedMilestones.length).toBe(2);
    expect(loadedMilestones[loadedMilestones.length - 1].constructor.name).toBe("Milestone2");
  });

  it("should recover after a global reset", () => {
    (ProgressiveStrat.prototype as any).getMilestoneFactories = () => [
      () => new Milestone1(myRoom.name, taskAllocator, config),
      () => new Milestone2(myRoom.name, taskAllocator, config),
      () => new Milestone3(myRoom.name, taskAllocator, config)
    ];

    jest.spyOn(Milestone1.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => true, () => ({}))
      ];
    });

    jest.spyOn(Milestone2.prototype, "init").mockImplementation(() => {
      config.conditions = [
        new StratCondition(() => true, () => ({}))
      ];
    });

    const _strat1 = new ProgressiveStrat(myRoom, taskAllocator);

    _strat1.update();
    _strat1.update();
    _strat1.update();
    _strat1.update();
    _strat1.update();
    const loadedMilestones1 = (_strat1 as any)._loadedMilestones;

    expect((_strat1 as any)._milestones.length).toBe(0);
    expect(loadedMilestones1.length).toBe(3);
    expect(loadedMilestones1[loadedMilestones1.length - 1].constructor.name).toBe("Milestone3");
    expect(Memory.rooms.myRoom.stratManager!.currentMilestone).toBe("Milestone3");

    const _strat2 = new ProgressiveStrat(myRoom, taskAllocator);
    const loadedMilestones2 = (_strat2 as any)._loadedMilestones;

    expect(loadedMilestones2.length).toBe(3);
    expect(loadedMilestones2[loadedMilestones2.length - 1].constructor.name).toBe("Milestone3");
    expect(Memory.rooms.myRoom.stratManager!.currentMilestone).toBe("Milestone3");
  });
});
