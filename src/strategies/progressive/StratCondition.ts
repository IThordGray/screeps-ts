import { IStratNeeds } from "../../abstractions/interfaces";

export enum StratConditionResult {
  Failed,
  Passed,
  Parallel,
  Recurring
}

export type StratConditionFn = () => StratConditionResult;
export type StratConditionActionFn = () => IStratNeeds;

export class StratCondition {
  constructor(
    public readonly name: string,
    public readonly check: StratConditionFn,
    public readonly action: StratConditionActionFn
  ) {
  }
}