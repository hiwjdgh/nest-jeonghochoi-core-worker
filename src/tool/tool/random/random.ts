import crypto from 'node:crypto';

export function randomInt(min: number, max: number): number {
    return crypto.randomInt(min, max + 1);
}

export function randomChoice<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Empty array');
    return arr[randomInt(0, arr.length - 1)];
}
