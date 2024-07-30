type IDestination = { id: string };
type ICollection = TryCollectOptions & IDestination;
type IDelivery = TryDeliverOptions & IDestination;

interface ILogisticsManager {
  clearCollectionSpot(id: string): void;

  getCollectionDestination(hauler: HaulerCreep): ICollection | undefined;

  getDeliveryDestination(hauler: HaulerCreep): IDelivery | undefined;

  requestCollectionSpot(...args: any[]): IDelivery;
}