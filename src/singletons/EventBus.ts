class EventBus {
  private readonly _subscribers: { [eventType: string]: Array<(...args: any[]) => void> } = {};

  emit(eventType: string, data: any) {
    if (!this._subscribers[eventType]) return;
    this._subscribers[eventType].forEach(subscribeFn => subscribeFn(data));
  }

  off(eventType: string, subscribeFn: (...args: any[]) => void) {
    if (!this._subscribers[eventType]) return;
    this._subscribers[eventType] = this._subscribers[eventType].filter(x => x !== subscribeFn);
  }

  on(eventType: string, subscribeFn: (...args: any[]) => void) {
    this._subscribers[eventType] ??= [];
    this._subscribers[eventType].push(subscribeFn);
  }
}

export const eventBus = new EventBus();
