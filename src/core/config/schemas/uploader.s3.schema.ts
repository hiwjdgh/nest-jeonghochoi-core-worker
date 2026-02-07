import { z } from 'zod';

export const S3ConfigSchema = z.object({
    region: z.string(),
    bucket: z.string(),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
});

export type S3Config = z.infer<typeof S3ConfigSchema>;
