export class Work {
  static state = 'working';
  static action = (creep: Creep) => creep.say('Working');
}