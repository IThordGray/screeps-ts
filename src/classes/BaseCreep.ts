import { generateUID } from "../helpers/generate-uid";

export abstract class BaseCreep {
  abstract role: string;
  abstract bodyParts: BodyPartConstant[];

  get minCost() {
    return this.bodyParts.reduce((p, c) => p += BODYPART_COST[c], 0);
  }

  getBody(budget: number) {
    let body = [ ...this.bodyParts ];
    let currentCost = this.minCost;

    let index = 0;
    while ((currentCost + BODYPART_COST[this.bodyParts[index % this.bodyParts.length]]) <= budget) {
      body.push(this.bodyParts[index % this.bodyParts.length]);
      currentCost += BODYPART_COST[this.bodyParts[index % this.bodyParts.length]];
      index++;
    }

    return body;
  };

  getName() {
    const uid = generateUID();
    return `${ this.role } ${ uid }`;
  };

  abstract run(creep: Creep): void;
}
