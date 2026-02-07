import { z } from 'zod';

export const SesConfigSchema = z.object({
    region: z.string(),
    from: z.string(),
});

export type SesConfig = z.infer<typeof SesConfigSchema>;
