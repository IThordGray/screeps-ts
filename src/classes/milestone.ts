export abstract class Milestone {
  abstract condition(...args: any[]): boolean;

  abstract run(...args: any[]): void;

  /** Called when this becomes the active milestone */
  init(): void {}

  /** Called when this is being replaced as the active milestone */
  dispose(): void {}
}
