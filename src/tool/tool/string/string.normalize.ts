export function trimToNull(v?: string | null): string | null {
    if (v == null) return null;
    const t = v.trim();
    return t.length === 0 ? null : t;
}

export function normalizeWhitespace(v: string): string {
    return v.replace(/\s+/g, ' ').trim();
}
