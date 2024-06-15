import { IStratNeeds } from "../../abstractions/interfaces";

export type StratConditionFn = () => boolean;
export type StratActionFn = () => IStratNeeds;

export class StratConfigCondition {
  constructor(
    public readonly name: string,
    public readonly check: StratConditionFn,
    public readonly action: StratActionFn
  ) {
  }
}