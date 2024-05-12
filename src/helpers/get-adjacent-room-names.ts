export function getAdjacentRoomNames(roomName: string) {
    const roomParts = roomName.match(/([WE])(\d+)([NS])(\d+)/)!;
    const ew = roomParts[1]; // W or E
    const ewNum = parseInt(roomParts[2], 10);
    const ns = roomParts[3]; // N or S
    const nsNum = parseInt(roomParts[4], 10);

    // Calculate adjacent rooms
    const north = `${ew}${ewNum}${ns}${nsNum + 1}`;
    const south = `${ew}${ewNum}${ns}${nsNum - 1}`;
    const east = `${ew === 'W' ? (ewNum === 0 ? 'E1' : 'W' + (ewNum - 1)) : 'E' + (ewNum + 1)}${ns}${nsNum}`;
    const west = `${ew === 'E' ? (ewNum === 0 ? 'W1' : 'E' + (ewNum - 1)) : 'W' + (ewNum + 1)}${ns}${nsNum}`;

    return { north, south, east, west };
}
