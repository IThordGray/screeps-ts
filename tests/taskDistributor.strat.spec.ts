import { mockGlobal, mockInstanceOf } from "screeps-jest";
import { CreepTypes } from "../src/abstractions/creep-types";
import { DroneMemory } from "../src/creeps/GenericDrone";
import { Logger } from "../src/helpers/logger";
import { StratManager } from "../src/services/StratManager";
import { TaskState } from "../src/states/TaskState";
import { ProgressiveStrat } from "../src/strategies/progressive/ProgressiveStrat";
import { TaskDistributor } from "../src/services/TaskDistributor";
import { TaskPriority } from "../src/tasking/TaskPriority";
import { BuildTask } from "../src/tasking/tasks/BuildTask";
import { HarvestTask } from "../src/tasking/tasks/HarvestTask";
import { HaulTask } from "../src/tasking/tasks/HaulTask";
import { ScoutingTask } from "../src/tasking/tasks/Scouting.task";
import { StationaryBuildTask } from "../src/tasking/tasks/StationaryBuildTask";
import spyOn = jest.spyOn;

const myController = mockInstanceOf<StructureController>({ my: true, level: 1 });
const myRoom = mockInstanceOf<Room>({
  controller: myController,
  name: "myRoom",
  find: () => [],
  owned: { state: {} }

});

const drone1 = mockInstanceOf<Creep>({ name: "drone1", memory: { role: CreepTypes.genericDrone, task: undefined } });
const drone2 = mockInstanceOf<Creep>({ name: "drone2", memory: { role: CreepTypes.genericDrone, task: undefined } });
const drone3 = mockInstanceOf<Creep>({ name: "drone3", memory: { role: CreepTypes.genericDrone, task: undefined } });
const drone4 = mockInstanceOf<Creep>({ name: "drone4", memory: { role: CreepTypes.genericDrone, task: undefined } });

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

class MockStrat implements IStrat {
  get creepNeeds(): ICreepRequirement[] {
    throw new Error("Method not implemented.");
  }

  get taskNeeds(): ITask[] {
    throw new Error("Method not implemented.");
  }

  getStatus(): Record<string, any> {
    throw new Error("Method not implemented.");
  }

  update(): void {
    throw new Error("Method not implemented.");
  }
}

describe("ProgressiveStrat", () => {
  let taskState: ITaskState;
  let stratManager: IStratManager;
  let taskDistributor: ITaskDistributor;
  let mockStrat: IStrat;

  beforeEach(() => {
    Game.creeps = {};
    Game.rooms = { myRoom };
    Game.time = 1;

    Memory.rooms = { myRoom: {} };

    stratManager = new StratManager(myRoom);
    mockStrat = new MockStrat();

    stratManager.getCurrentStrat = () => mockStrat;
    taskDistributor = new TaskDistributor(myRoom);
    taskState = new TaskState(myRoom);

    myRoom.owned.stratManager = stratManager;
    myRoom.owned.taskDistributor = taskDistributor;
    myRoom.owned.state.taskState = taskState;
  });

  afterEach(() => {

  });

  it("should prioritise higher order tasks", () => {

    const buildTask = new BuildTask({ pos: new RoomPosition(0, 0, ''), constructionSiteId: 'abc' as any });
    const scoutTask = new ScoutingTask({ pos: new RoomPosition(0, 0, ''), roomNames: 'abc' as any });
    const haulerTask = new HaulTask({ pos: new RoomPosition(0, 0, ''), pickupPos: new RoomPosition(0, 0, ''), dropOffPos: new RoomPosition(0, 0, '') });
    const harvestTask = new HarvestTask({ pos: new RoomPosition(0, 0, ''), sourceId: 'abc' as any });

    jest.spyOn(mockStrat, "taskNeeds", "get").mockReturnValue([
      buildTask,
      harvestTask,
      scoutTask,
      haulerTask,
      harvestTask
    ]);

    jest.spyOn(taskState, 'getUnallocatedDrones').mockImplementation(() => [drone1, drone2, drone3, drone4]);
    taskDistributor.run();

    expect((drone1.memory as DroneMemory).task).toEqual(harvestTask);
    expect((drone2.memory as DroneMemory).task).toEqual(harvestTask);
    expect((drone3.memory as DroneMemory).task).toEqual(haulerTask);
    expect((drone4.memory as DroneMemory).task).toEqual(buildTask);
  });

  it("should prioritise priory tasks", () => {

    const buildTask = new BuildTask({ pos: new RoomPosition(0, 0, ''), constructionSiteId: 'abc' as any });
    const scoutTask = new ScoutingTask({ pos: new RoomPosition(0, 0, ''), roomNames: 'abc' as any, priority: TaskPriority.high });
    const haulerTask = new HaulTask({ pos: new RoomPosition(0, 0, ''), pickupPos: new RoomPosition(0, 0, ''), dropOffPos: new RoomPosition(0, 0, '') });
    const harvestTask = new HarvestTask({ pos: new RoomPosition(0, 0, ''), sourceId: 'abc' as any });

    jest.spyOn(mockStrat, "taskNeeds", "get").mockReturnValue([
      buildTask,
      harvestTask,
      scoutTask,
      haulerTask,
      harvestTask
    ]);

    jest.spyOn(taskState, 'getUnallocatedDrones').mockImplementation(() => [drone1, drone2, drone3, drone4]);
    taskDistributor.run();

    expect((drone1.memory as DroneMemory).task).toEqual(scoutTask);
    expect((drone2.memory as DroneMemory).task).toEqual(harvestTask);
    expect((drone3.memory as DroneMemory).task).toEqual(harvestTask);
    expect((drone4.memory as DroneMemory).task).toEqual(haulerTask);
  });

  it("should should add task replacement weights", () => {

    const buildTask = new BuildTask({ pos: new RoomPosition(0, 0, ''), constructionSiteId: 'abc' as any }); // 30 + 75 - 20 | 85
    const stationaryBuildTask = new StationaryBuildTask({ pos: new RoomPosition(0, 0, ''), constructionSiteId: 'abc' as any }); // 30 + 75 + 60 - 20 | 145
    const scoutTask = new ScoutingTask({ pos: new RoomPosition(0, 0, ''), roomNames: 'abc' as any, priority: TaskPriority.high }); // 10 + 150 - 20 | 140
    const harvestTask = new HarvestTask({ pos: new RoomPosition(0, 0, ''), sourceId: 'abc' as any }); // 80 + 75 - 20 | 135

    (drone1.memory as DroneMemory).task = harvestTask;
    (drone2.memory as DroneMemory).task = buildTask;
    (drone3.memory as DroneMemory).task = scoutTask;

    jest.spyOn(mockStrat, "taskNeeds", "get").mockReturnValue([
      stationaryBuildTask,
    ]);

    jest.spyOn(taskState, 'getUnallocatedDrones').mockImplementation(() => []);
    jest.spyOn(taskState, 'getAllocatedDrones').mockImplementation(() => [drone1, drone2, drone3]);
    taskDistributor.run();

    expect((drone1.memory as DroneMemory).task).toEqual(harvestTask);
    expect((drone2.memory as DroneMemory).task).toEqual(stationaryBuildTask);
    expect((drone3.memory as DroneMemory).task).toEqual(scoutTask);
    expect((drone4.memory as DroneMemory).task).toEqual(undefined);
  });

});
