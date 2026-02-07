export function groupBy<T, K extends PropertyKey>(
    arr: readonly T[],
    keyFn: (item: T) => K
): Record<K, T[]> {
    return arr.reduce((acc, item) => {
        const key = keyFn(item);
        (acc[key] ??= []).push(item);
        return acc;
    }, {} as Record<K, T[]>);
}
