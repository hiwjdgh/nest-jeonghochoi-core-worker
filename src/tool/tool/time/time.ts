export function nowUnixMs(): number {
    return Date.now();
}

export function nowIso(): string {
    return new Date().toISOString();
}

export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}
