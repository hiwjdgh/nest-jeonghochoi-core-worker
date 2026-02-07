import { z } from 'zod';

export const FtpConfigSchema = z.object({
    host: z.string(),
    port: z.coerce.number().default(21),
    user: z.string(),
    password: z.string(),
    secure: z.boolean().default(false),
    basePath: z.string().optional(),
});

export type FtpConfig = z.infer<typeof FtpConfigSchema>;
