export class PosUtils {
  static new(pos: RoomPosition | undefined): RoomPosition | undefined {
    if (!pos) return undefined;
    return new RoomPosition(pos.x, pos.y, pos.roomName);
  }
}