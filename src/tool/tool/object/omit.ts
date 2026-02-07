export function omit<T extends object, K extends readonly (keyof T)[]>(
    obj: T,
    keys: K
): Omit<T, K[number]> {
    const result = { ...obj } as any;
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
