import { z } from 'zod';

export const RedisConfigSchema = z.object({
    host: z.string(),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    db: z.coerce.number().default(0),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;
