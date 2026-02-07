import crypto from 'node:crypto';

export function uuidV4(): string {
    return crypto.randomUUID();
}
