import { z } from 'zod';

export const TemplateConfigSchema = z.object({
    templateDir: z.string(),
});

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
