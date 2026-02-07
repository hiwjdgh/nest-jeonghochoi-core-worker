import { z } from 'zod';

export const HttpConfigSchema = z.object({
    timeoutMs: z.coerce.number().default(5000),
    retries: z.coerce.number().default(3),
});

export type HttpConfig = z.infer<typeof HttpConfigSchema>;
