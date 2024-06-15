interface IStrat extends IRequirements {
  getStatus(): Record<string, any>;

  update(): void;
}

interface IStratManager {
  getCurrentStrat(): IStrat;

  update(): void;
}