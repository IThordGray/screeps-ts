import { mockGlobal, mockInstanceOf } from "screeps-jest";
import { unwrappedLoop } from "../src/main";

const myController = mockInstanceOf<StructureController>({ my: true, level: 1 });
const myRoom = mockInstanceOf<Room>({ controller: myController, name: 'myRoom', find: () => [] });

beforeEach(() => {
  mockGlobal("Game", {
    creeps: {},
    rooms: {},
    time: 1
  }, true);

  mockGlobal<Memory>('Memory', {}, true);
});

describe("main loop", () => {
  it("should run the main loop", () => {
    const drone = mockInstanceOf<Creep>({ memory: { type: 'drone', room: 'myRoom' }}, true);
    Game.rooms.myRoom = myRoom;
    Game.creeps['droneA'] = drone;

    Memory.creeps = {
      droneA: drone.memory,
      dead: { type: 'dead', room: 'a' }
    }

    unwrappedLoop();

    expect(Memory.creeps).toEqual({ droneA: drone.memory });
  });
});