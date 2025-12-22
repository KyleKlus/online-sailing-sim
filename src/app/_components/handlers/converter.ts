export function convertToDegrees(rad: number, accuracy: number = 4): number {
    return Math.round((rad * (180 / Math.PI)) * 10 ** accuracy) / 10 ** accuracy;
}

export function convertToRadians(deg: number, accuracy: number = 4): number {
    return Math.round((deg * (Math.PI / 180)) * 10 ** accuracy) / 10 ** accuracy;
}