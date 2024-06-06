// import { ICreepRequirement, IRequirements, IStrat } from "../../abstractions/interfaces";
// import { genericDroneCreep } from "../../creeps/generic-drone";
// import { RoomState } from "../../states/roomState";
// import { Task } from "../../tasking/task";
// import { TaskAllocator } from "../../tasking/taskAllocator";
// import { BuildTask } from "../../tasking/tasks/build.task";
// import { HarvestTask } from "../../tasking/tasks/harvest.task";
// import { UpgradeTask } from "../../tasking/tasks/upgrade.task";
// import { TaskType } from "../../tasking/taskType";
// import { BuildingMilestone } from "./milestones/building.milestone";
// import { DroneMilestone } from "./milestones/drone.milestone";
// import { Milestone } from "./milestones/milestone";
// import { MiningMilestone } from "./milestones/mining.milestone";
// import { UpgradeToLvl2Milestone } from "./milestones/upgradeToLvl2.milestone";
//
// export class ProgressiveStrat implements IStrat, IRequirements {
//   private _milestones: Milestone[] = [];
//
//   protected _taskRequirements: Task[] = [];
//   protected _creepRequirement?: ICreepRequirement;
//
//   constructor(
//     private readonly _room: Room,
//     private readonly _taskAllocator: TaskAllocator
//   ) {
//     this._milestones = [];
//     this._milestones.push(new DroneMilestone(this._room.name, this._taskAllocator));
//     this._milestones.push(new MiningMilestone(this._room.name, this._taskAllocator));
//     this._milestones.push(new UpgradeToLvl2Milestone(this._room.name, this._taskAllocator));
//     this._milestones.push(new BuildingMilestone(this._room.name, this._taskAllocator));
//     // this._milestones.push(new ScoutingMilestone(this._room.name, this._taskAllocator));
//   }
//
//   private getCurrentMilestone() {
//     return this._milestones.find(milestone => !milestone.condition());
//   }
//
//   creepNeeds(): ICreepRequirement | undefined {
//     return this._creepRequirement;
//     // return this.getCurrentMilestone()?.getCreepRequirement();
//   }
//
//   taskNeeds(): Task[] {
//     return this._taskRequirements;
//     // return this.getCurrentMilestone()?.getTaskRequirements() ?? [];
//   }
//
//   update(): void {
//     const roomState = this._room.owned.state;
//     const budget = roomState.room.energyCapacityAvailable;
//     const [ source ] = roomState.resourceState.getSources();
//     const config = {
//       harvesters: 2,
//       upgraders: 2,
//       builders: 2
//     }
//
//     const harvesters = this._taskAllocator.getAllocatedDrones(TaskType.harvest);
//     if (harvesters.length < config.harvesters) {
//       this._creepRequirement = genericDroneCreep.need(budget, {
//         task: new HarvestTask({
//           pos: source.pos,
//           sourceId: source.id
//         })
//       });
//       return;
//     }
//
//     const upgraders = this._taskAllocator.getAllocatedDrones(TaskType.upgrade);
//     if (upgraders.length < config.upgraders) {
//       this._creepRequirement = genericDroneCreep.need(budget, {
//         task: new UpgradeTask({
//           pos: roomState.controller.pos,
//           controllerId: roomState.controller.id
//         })
//       });
//
//       return;
//     }
//
//     if (roomState.controller.level === 2) {
//       config.upgraders = 1;
//       config.builders = 3;
//     }
//
//     const builders = this._taskAllocator.getAllocatedDrones(TaskType.build);
//     if (upgraders.length > config.upgraders) this._taskRequirements = [new BuildTask({ pos: roomState.spawn.pos })]
//     if (roomState.controller.level === 2 && builders.length < config.builders) {
//       this._creepRequirement = genericDroneCreep.need(budget, {
//         task: new BuildTask({
//           pos: roomState.spawn.pos
//         })
//       });
//       return;
//     }
//
//     config.harvesters = 4;
//     if (harvesters.length < config.harvesters) {
//       this._creepRequirement = genericDroneCreep.need(budget, {
//         task: new HarvestTask({
//           pos: source.pos,
//           sourceId: source.id
//         })
//       });
//       return;
//     }
//
//
//
//     // const currentMilestone = this.getCurrentMilestone();
//     // currentMilestone?.update();
//   }
// }
