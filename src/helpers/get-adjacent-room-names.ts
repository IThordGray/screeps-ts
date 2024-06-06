export enum Direction {
  north = FIND_EXIT_TOP,
  east = FIND_EXIT_RIGHT,
  south = FIND_EXIT_BOTTOM,
  west = FIND_EXIT_LEFT
}

export function getAdjacentRoomNames(roomName: string) {
  const adjacentRooms: Record<Direction, string> = {};
  const exits = Game.map.describeExits(roomName);
  if (!exits) return adjacentRooms;

  if (exits[FIND_EXIT_TOP]) adjacentRooms[Direction.north] = exits[FIND_EXIT_TOP];
  if (exits[FIND_EXIT_RIGHT]) adjacentRooms[Direction.east] = exits[FIND_EXIT_RIGHT];
  if (exits[FIND_EXIT_BOTTOM]) adjacentRooms[Direction.south] = exits[FIND_EXIT_BOTTOM];
  if (exits[FIND_EXIT_LEFT]) adjacentRooms[Direction.west] = exits[FIND_EXIT_LEFT];
  return adjacentRooms;
}
