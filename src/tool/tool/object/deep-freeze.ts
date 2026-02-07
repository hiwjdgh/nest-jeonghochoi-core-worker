export function deepFreeze<T>(obj: T): Readonly<T> {
    if (obj && typeof obj === 'object') {
        Object.freeze(obj);
        for (const value of Object.values(obj as any)) {
            deepFreeze(value);
        }
    }
    return obj;
}
