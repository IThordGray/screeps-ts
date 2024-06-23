import { CreepTypes } from "../abstractions/creep-types";
import { TableConfig, VisualUtils } from "../helpers/visualUtils";
import { TaskTypes } from "../tasking/TaskTypes";

export class Dashboard implements IDashboard {

  constructor(
    public readonly room: Room
  ) {
  }

  private renderCreepCount() {
    const rows = [
      [ "Miners", this.room.owned.state.creepState.getCreepCount(CreepTypes.miner) ],
      [ "Haulers", this.room.owned.state.creepState.getCreepCount(CreepTypes.hauler) ],
      [ "Scouts", this.room.owned.state.creepState.getCreepCount(CreepTypes.scout) ],
      [ "Builders", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.build)?.length ?? 0 ],
      [ "SBuilders", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.stationaryBuild)?.length ?? 0 ],
      [ "Harvester", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.harvest)?.length ?? 0 ],
      [ "Repairers", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.repair)?.length ?? 0 ],
      [ "Upgraders", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.upgrade)?.length ?? 0 ],
      [ "SUpgraders", this.room.owned.state.taskState.getAllocatedDrones(TaskTypes.stationaryUpgrade)?.length ?? 0 ]
    ].filter(([ d, c ]) => !!c);

    const tableConfig = new TableConfig({
      data: rows,
      columns: [ { columnName: "Unit", columnWidth: 3 }, { columnName: "Count", columnWidth: 3 } ]
    });
    VisualUtils.createTable(this.room.name, 0, 0, tableConfig);
  }

  private renderStratDetails() {
    const currentStrat = this.room.owned.stratManager.getCurrentStrat();
    if (!currentStrat) return;

    const rows = [];

    const status = currentStrat.getStatus();
    for (const key of Object.keys(status)) {
      rows.push([ key, status[key] ]);
    }

    const tableConfig = new TableConfig({
      data: rows,
      columns: [ { columnWidth: 4 }, { columnWidth: 4 } ]
    });
    VisualUtils.createTable(this.room.name, 6, 0, tableConfig);
  }

  private renderCurrentNeeds() {
    const creepNeeds = this.room.owned.stratManager.getCurrentStrat().creepNeeds;
    const taskNeeds = this.room.owned.stratManager.getCurrentStrat().taskNeeds;

    const creepNeedsTableConfig = new TableConfig({
      data: creepNeeds.map(x => ([x.creepType])),
      columns: [ { columnWidth: 4, columnName: 'CreepNeeds' } ]
    });

    const taskNeedsTableConfig = new TableConfig({
      data: taskNeeds.map(x => ([x.type])),
      columns: [ { columnWidth: 4, columnName: 'TaskNeeds' } ]
    });

    VisualUtils.createTable(this.room.name, 14, 0, creepNeedsTableConfig);
    VisualUtils.createTable(this.room.name, 18, 0, taskNeedsTableConfig);
  }

  render(): void {
    this.renderCreepCount();
    this.renderStratDetails();
    this.renderCurrentNeeds();
  }
}