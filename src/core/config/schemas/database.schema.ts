import { z } from 'zod';

export const DbmsSchema = z.enum(['mysql', 'mssql', 'postgresql']);

export const DatabaseInstanceSchema = z.object({
    dbms: DbmsSchema,
    host: z.string(),
    port: z.coerce.number(),
    user: z.string(),
    password: z.string(),
    database: z.string().optional(),
    poolSize: z.coerce.number().default(10),
});

export const DatabaseConfigSchema = z.object({
    instances: z.record(z.string(), DatabaseInstanceSchema),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
