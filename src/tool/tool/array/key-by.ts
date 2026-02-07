export function keyBy<T, K extends PropertyKey>(
    arr: readonly T[],
    keyFn: (item: T) => K
): Record<K, T> {
    return arr.reduce((acc, item) => {
        acc[keyFn(item)] = item;
        return acc;
    }, {} as Record<K, T>);
}
