export function checkDistance(p1: RoomPosition, p2: RoomPosition, distance: number) {
    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    return (dx + dy) === distance;
}
