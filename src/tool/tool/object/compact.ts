export function compact<T extends object>(
    obj: T
): {
    [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
} {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}
