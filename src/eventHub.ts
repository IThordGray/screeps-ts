import { EventTypes } from "./abstractions/EventTypes";
import { Logger } from "./helpers/logger";
import { eventBus } from "./singletons/EventBus";

class EventHub {
  private readonly _onCreepSpawn = (creep: Creep) => {
    Logger.success(`Creep spawned: ${ creep.name }`);
  };

  private readonly _onCreepDeath = (creep: Creep) => {
    Logger.warn(`Creep died: ${ creep.name }`);
  };

  private readonly _onMilestoneActivated = ({ name }: any) => {
    Logger.info(`Milestone activated: ${ name }`);
  };

  private readonly _onControllerUpgraded = ({ level, tick }: { level: number, tick: number }) => {
    Logger.info(`Controller upgraded to ${ level } at ${ tick }`);
  };

  register(): void {
    eventBus.on(EventTypes.creepSpawned, this._onCreepSpawn.bind(this));
    eventBus.on(EventTypes.creepDied, this._onCreepDeath.bind(this));
    eventBus.on(EventTypes.milestoneActivated, this._onMilestoneActivated.bind(this));
    eventBus.on(EventTypes.controllerUpgraded, this._onControllerUpgraded.bind(this));
  }
}

export const eventHub = new EventHub();