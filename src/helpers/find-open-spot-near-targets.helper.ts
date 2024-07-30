export function findOpenSpotNearTargets(targets: RoomPosition[], range: number): RoomPosition | null {
  const room = Game.rooms[targets[0].roomName];

  for (const target of targets) {
    const area = room.lookAtArea(
      target.y - range,
      target.x - range,
      target.y + range,
      target.x + range,
      true
    );

    for (const position of area) {
      if (position.type === 'terrain' && position.terrain === 'plain' || position.terrain === 'swamp') {
        if (room.lookForAt(LOOK_CREEPS, position.x, position.y).length === 0 &&
          room.lookForAt(LOOK_STRUCTURES, position.x, position.y).length === 0 &&
          room.lookForAt(LOOK_CONSTRUCTION_SITES, position.x, position.y).length === 0) {
          return new RoomPosition(position.x, position.y, target.roomName);
        }
      }
    }
  }

  return null;
}