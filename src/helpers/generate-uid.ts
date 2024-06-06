export function generateUID(): string {
    // Timestamp (4 bytes)
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');

    // Random value (5 bytes)
    let randomValue = '';
    for (let i = 0; i < 5; i++) {
        randomValue += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }

    // Counter (3 bytes)
    let counter = '';
    for (let i = 0; i < 3; i++) {
        counter += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }

    // Combine to get the ObjectId
    return timestamp + randomValue + counter;
}
