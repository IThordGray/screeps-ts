const injectableRegistry: { [key: string]: any } = {};
const groupByRoom: { [room: string]: { [type: string]: any } } = {};

export function Injectable(config: { name: string }) {
  return (target: Function) => {
    injectableRegistry[target.name] = [ config.name, target ];
  };
}

export function provide(room: any /*Room*/) {
  groupByRoom[room.name] ??= {};
  const injectables = Object.entries(injectableRegistry);
  const roomServices = groupByRoom[room.name];

  for (const [ serviceType, [ serviceName, target ] ] of injectables) {
    roomServices[serviceType] ??= new target(room);
    room[serviceName] ??= roomServices[serviceType];
  }
}