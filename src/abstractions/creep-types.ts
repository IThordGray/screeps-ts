export const CreepTypes = {
    miner: 'miner',
    hauler: 'hauler',
    scout: 'scout',
    ldh: 'ldh',
    drone: 'drone',
}

export type CreepType = typeof CreepTypes[keyof typeof CreepTypes];
