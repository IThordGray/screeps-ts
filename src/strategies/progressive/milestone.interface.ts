import { IRequirements } from "../../abstractions/interfaces";

export interface IMilestone extends IRequirements {
  condition(room: Room): boolean;

  update(room: Room): void;
}