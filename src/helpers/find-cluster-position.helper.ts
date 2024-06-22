export function findOptimalClusterPosition(targetPos: RoomPosition, creeps: Creep[], range: number = 5): RoomPosition {
  // Generate potential cluster positions within the given range
  const potentialPositions: RoomPosition[] = [];
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const x = targetPos.x + dx;
      const y = targetPos.y + dy;
      if (x >= 0 && x < 50 && y >= 0 && y < 50) {
        potentialPositions.push(new RoomPosition(x, y, targetPos.roomName));
      }
    }
  }

  // Function to calculate the total distance for all creeps to a given position
  const totalDistance = (pos: RoomPosition): number => {
    return creeps.reduce((sum, creep) => sum + creep.pos.getRangeTo(pos), 0);
  };

  // Find the position with the minimum total distance
  let optimalPosition = potentialPositions[0];
  let minDistance = totalDistance(optimalPosition);

  for (const pos of potentialPositions) {
    const distance = totalDistance(pos);
    if (distance < minDistance) {
      minDistance = distance;
      optimalPosition = pos;
    }
  }

  return optimalPosition;
}