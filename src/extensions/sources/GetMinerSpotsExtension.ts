import { CreepTypes } from "../../abstractions/CreepTypes";
import { PosUtils } from "../../utils/pos.utils";

Source.prototype.getMinerSpots = function() {
  const adjacentSpots = this.getAdjacentSpots();
  const miners = this.room.owned?.state.creepState.getCreeps(CreepTypes.miner) ?? [];
  return adjacentSpots.filter(spot => {
    const allocated = miners.some(miner => {
      const memory = miner.memory as MinerMemory;
      const pos = PosUtils.new(memory.pos);
      return !!pos?.isEqualTo(spot);
    });

    return !allocated;
  });
};