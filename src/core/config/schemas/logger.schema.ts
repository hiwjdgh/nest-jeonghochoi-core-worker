// src/config/schemas/logger.schema.ts
import { z } from 'zod';

export const LoggerConfigSchema = z.object({
    level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
    pretty: z.boolean().default(false),
    service: z.string().optional(),
});

export type LoggerConfig = z.infer<typeof LoggerConfigSchema>;
