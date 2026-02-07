export const REGEX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneKR: /^01[016789]-?\d{3,4}-?\d{4}$/,
    uuidV4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    transactionId: /^[A-Z0-9_-]{16,64}$/,
} as const;
