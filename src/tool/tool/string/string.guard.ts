export function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

export function assertNonEmptyString(
    v: unknown,
    message = 'Value must be a non-empty string'
): asserts v is string {
    if (!isNonEmptyString(v)) {
        throw new Error(message);
    }
}
