import crypto from 'node:crypto';

export function createTransactionId(opts?: {
    prefix?: string;
    length?: number;
}): string {
    const length = opts?.length ?? 24;
    const raw = crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .toUpperCase();

    const id = raw.slice(0, length);
    return opts?.prefix ? `${opts.prefix}_${id}` : id;
}
