Source.prototype.getOpenSpots = function(range: number = 1) {
  const adjacentSpots = this.getAdjacentSpots(range);
  return adjacentSpots.filter(x => !x.lookFor(LOOK_CREEPS)?.length);
};