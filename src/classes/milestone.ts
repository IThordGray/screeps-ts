export abstract class Milestone {
  abstract condition(...args: any[]): boolean;

  /** Called when this is being replaced as the active milestone */
  dispose(): void {
  }

  /** Called when this becomes the active milestone */
  init(): void {
  }

  abstract run(...args: any[]): void;
}
