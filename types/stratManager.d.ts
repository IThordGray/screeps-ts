interface IStrat extends IRequirements {
  update(): void;
}

interface IStratManager {
  getCurrentStrat(): IStrat;

  update(): void;
}