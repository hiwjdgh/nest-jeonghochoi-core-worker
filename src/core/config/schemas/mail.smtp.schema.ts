import { z } from 'zod';

export const SmtpConfigSchema = z.object({
    host: z.string(),
    port: z.coerce.number(),
    secure: z.boolean().default(false),
    user: z.string(),
    password: z.string(),
    from: z.string(),
});

export type SmtpConfig = z.infer<typeof SmtpConfigSchema>;
