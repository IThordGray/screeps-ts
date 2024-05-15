type StateCheck = {
  condition: (creep: Creep) => boolean,
  action: (creep: Creep) => void
}

export class CheckState {

  constructor(
    private stateChecks: { [key: string]: StateCheck }
  ) { }

  check(creep: Creep): void {
    for (const state in this.stateChecks) {
      const { condition, action } = this.stateChecks[state];

      if (condition(creep)) {
        creep.memory.state = state;
        action(creep);
        break;
      }
    }
  }
}