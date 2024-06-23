// import { CreepTypes } from "abstractions/creep-types";
// import { ICreepRequirement } from "abstractions/interfaces";
// import { getAdjacentRoomNames } from "helpers/get-adjacent-room-names";
// import { Task } from "tasking/task";
// import { scoutCreep } from "../../../creeps/scout";
//
// import { RoomState } from "../../../states/roomState";
// import { TaskAllocator } from "../../../tasking/taskAllocator";
// import { Milestone } from "./milestone";
//
// export class ScoutingMilestone extends Milestone {
//   private readonly _roomIds: string[] = [];
//
//   constructor(room: string, taskAllocator: TaskAllocator) {
//     super(room, taskAllocator);
//     this._roomIds = Object.values(getAdjacentRoomNames(this._roomName));
//   }
//
//   condition(): boolean {
//     return this._roomIds.every(x => !!Memory.scoutedRooms[x]);
//   }
//
//   update(): void {
//     const scouts = this._room.owned.state.creepState.getCreepCount(CreepTypes.scout);
//     const availableEnergy = this._room.owned.state.room.energyCapacityAvailable;
//
//     if (!scouts) this._creepRequirement = scoutCreep.need(availableEnergy, { roomNames: this._roomIds });
//   }
//
// }
