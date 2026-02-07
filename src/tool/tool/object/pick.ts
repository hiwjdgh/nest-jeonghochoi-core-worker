export function pick<T extends object, K extends readonly (keyof T)[]>(
    obj: T,
    keys: K
): Pick<T, K[number]> {
    const result = {} as Pick<T, K[number]>;
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
