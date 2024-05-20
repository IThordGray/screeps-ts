import { CreepType } from "../../abstractions/creep-types";
import { IStrat } from "../../abstractions/interfaces";
import { Task } from "../../tasking/task";
import { TaskAllocator } from "../../tasking/taskAllocator";
import { DroneMilestone } from "./milestones/drone.milestone";
import { Milestone } from "./milestones/milestone";
import { MiningMilestone } from "./milestones/mining.milestone";
import { ScoutingMilestone } from "./milestones/scouting.milestone";

const MilestoneLoader = [
  (room: string, taskAllocator: TaskAllocator) => new DroneMilestone(room, taskAllocator),
  (room: string, taskAllocator: TaskAllocator) => new MiningMilestone(room, taskAllocator),
  // Create a specialised scout and set to scout unscouted rooms
  // (room: string, taskAllocator: TaskAllocator) => new ScoutingMilestone(room, taskAllocator)
  // Create 3 drones per room exit * sources in that room (for instance: 2 exits => 3 total adjacent sources => 9 drones) + 9 LongDistanceHarvestTasks
  // (room: string) => new LdhMilestone(room)
];

export class ProgressiveStrat implements IStrat {
  private _milestones: Milestone[] = [];

  constructor(
    private readonly _room: Room,
    private readonly _taskAllocator: TaskAllocator
  ) {
  }

  private getCurrentMilestone() {
    return this._milestones.find(milestone => !milestone.condition());
  }

  private loadNextMilestone() {
    const nextMilestoneFactory = MilestoneLoader.shift();
    if (!nextMilestoneFactory) return undefined;
    const nextMilestone = nextMilestoneFactory(this._room.name, this._taskAllocator);
    this._milestones.push(nextMilestone);
    return nextMilestone;
  }

  getCreepRequirements(): { creepType: CreepType, budget: number, properties?: Record<string, any> }[] {
    return this.getCurrentMilestone()?.getCreepRequirements() ?? [];
  }

  getTaskRequirements(): Task[] {
    return this.getCurrentMilestone()?.getTaskRequirements() ?? [];
  }

  isDone(): boolean {
    return this._milestones.length === MilestoneLoader.length && this._milestones.every(x => x.condition());
  }

  update(): void {
    let currentMilestone = this.getCurrentMilestone();
    currentMilestone ??= this.loadNextMilestone();
    currentMilestone?.update();
  }
}
