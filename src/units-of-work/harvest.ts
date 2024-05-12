export class Harvest {
    static action = (creep: Creep) => creep.say("⛏️ harvesting");

    private _getTarget: (creep: Creep) => Source | null;

    constructor(args: {
        getTarget: (creep: Creep) => Source | null
    }) {
        this._getTarget = args.getTarget
    }

    run(creep: Creep) {
        const source = this._getTarget(creep);
        if (!source) return;

        if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source);
    }
}
