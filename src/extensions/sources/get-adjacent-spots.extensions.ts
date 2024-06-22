Source.prototype.getAdjacentSpots = function(range: number = 1) {
  const terrain = Game.map.getRoomTerrain(this.room.name);
    const positions: RoomPosition[] = [];

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0) continue;

      const x = this.pos.x + dx;
      const y = this.pos.y + dy;

      if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        positions.push(new RoomPosition(x, y, this.room.name));
      }
    }
  }

  return positions;
};