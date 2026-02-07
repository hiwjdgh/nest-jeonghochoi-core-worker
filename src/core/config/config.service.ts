// src/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { CoreConfigFactory } from './config.types.js';

@Injectable()
export class CoreConfigService<T> {
    private readonly config: T;

    constructor(factory: CoreConfigFactory<T>) {
        const raw = factory.load();
        const parsed = factory.schema.safeParse(raw);

        if (!parsed.success) {
            console.error(parsed.error.format());
            throw new Error('❌ Invalid configuration');
        }

        this.config = Object.freeze(parsed.data);
    }

    get(): T {
        return this.config;
    }
}
