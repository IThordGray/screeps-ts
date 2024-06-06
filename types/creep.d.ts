interface Creep {
  isBuilding: boolean;
  isCollecting: boolean;
  isDelivering: boolean;
  isDropping: boolean;
  isHarvesting: boolean;
  isPickingUp: boolean;
  isScouting: boolean;
  isUpgrading: boolean;
  isWithdrawing: boolean;

  tryBuild(options: TryBuildOptions): void;
  tryCollect(options: TryCollectOptions): void;
  tryDeliver(options: TryDeliverOptions): void;
  tryDrop(options: TryDropOptions): void;
  tryHarvest(options: TryHarvestOptions): void;
  tryPickup(options: TryPickupOptions): void;
  // tryScout(options: TryScoutOptions): void;
  tryTransfer(options: TryTransferOptions): void;
  tryUpgrade(options: TryUpgradeOptions): void;
  tryWithdraw(options: TryWithdrawOptions): void;
}