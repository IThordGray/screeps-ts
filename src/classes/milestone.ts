import { OnDispose, OnInit, OnRun, OnUpdate } from "../abstractions/interfaces";

export abstract class Milestone implements OnInit, OnUpdate, OnRun, OnDispose {
  abstract condition(...args: any[]): boolean;

  /** Called when this is being replaced as the active milestone */
  dispose(): void { }

  /** Called when this becomes the active milestone */
  init(): void { }

  abstract run(...args: any[]): void;

  update() { }
}
