export function generateUID(): string {
    const timestamp = Date.now();
    const randomPart = Math.random();
    return (timestamp * randomPart).toString(36);
}
