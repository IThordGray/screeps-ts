interface Source {
  getAdjacentSpots(range?: number): RoomPosition[];
  getOpenSpots(): RoomPosition[];
  getMinerSpots(): RoomPosition[];
}