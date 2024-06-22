import { IStratNeeds } from "../../abstractions/interfaces";

export enum StratConditionResult {
  Failed,
  Passed,
  Parallel,
  Recurring
}

export type StratConditionFn = () => StratConditionResult;
export type StratActionFn = () => IStratNeeds;

export class StratConfigCondition {
  constructor(
    public readonly name: string,
    public readonly check: StratConditionFn,
    public readonly action: StratActionFn
  ) {
  }
}