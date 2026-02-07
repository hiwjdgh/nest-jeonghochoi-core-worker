import { ZodSchema } from 'zod';

export type CoreConfigSchema<T> = ZodSchema<T>;

export interface CoreConfigFactory<T> {
    schema: CoreConfigSchema<T>;
    load: () => unknown;
}
