export class CheckWorking {

    private _isNotWorking: (creep: Creep) => boolean;
    private _isWorking: (creep: Creep) => boolean;
    private _notWorkingAction?: (creep: Creep) => void;
    private _workingAction?: (creep: Creep) => void;

    constructor(args: {
        isWorkingAnd: (creep: Creep) => boolean,
        isNotWorkingAnd: (creep: Creep) => boolean,
        workingAction?: (creep: Creep) => void,
        notWorkingAction?: (creep: Creep) => void
    }) {

        this._isNotWorking = args.isNotWorkingAnd;
        this._isWorking = args.isWorkingAnd;

        this._notWorkingAction = args.notWorkingAction;
        this._workingAction = args.workingAction;
    }

    run(creep: Creep) {
        if (creep.memory.working && this._isWorking(creep)) {
            creep.memory.working = false;
            this._notWorkingAction?.(creep);
            return;
        }

        if (!creep.memory.working && this._isNotWorking(creep)) {
            creep.memory.working = true;
            this._workingAction?.(creep);
            return;
        }
    }
}
