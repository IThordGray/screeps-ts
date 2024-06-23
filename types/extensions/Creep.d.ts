interface Creep {
  isBuilding: boolean;
  isCollecting: boolean;
  isDelivering: boolean;
  isDropping: boolean;
  isHarvesting: boolean;
  isMining: boolean;
  isPickingUp: boolean;
  isScouting: boolean;
  isUpgrading: boolean;
  isWithdrawing: boolean;

  tryBuild(options: TryBuildOptions): TryBuildReturnCode;
  tryCollect(options: TryCollectOptions): TryCollectReturnCode;
  tryDeliver(options: TryDeliverOptions): TryDeliverReturnCode;
  tryDrop(options: TryDropOptions): TryDropReturnCode;
  tryHarvest(options: TryHarvestOptions): TryHarvestReturnCode;
  tryMine(options: TryMineOptions): TryMineReturnCode;
  tryPickup(options: TryPickupOptions): TryPickupReturnCode;
  // tryScout(options: TryScoutOptions): void;
  tryTransfer(options: TryTransferOptions): TryTransferReturnCode;
  tryUpgrade(options: TryUpgradeOptions): TryUpgradeReturnCode;
  tryWithdraw(options: TryWithdrawOptions): TryWithdrawReturnCode;
}