import { RoomInstance } from "./room.instance";

class RoomManager {
  run(room: Room): void {
    const roomInstance = new RoomInstance(room.name);
    roomInstance.run();
  }
}

export const roomManager = new RoomManager();