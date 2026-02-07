import { Injectable } from '@nestjs/common';
import { CoreConfigService } from '../config/config.service.js';
import { DatabaseConfig } from '../config/schemas/database.schema.js';

@Injectable()
export class DatabaseConfigService {
    constructor(
        private readonly config: CoreConfigService<{ database: DatabaseConfig }>
    ) {}

    getInstance(rdsId: string) {
        const instance = this.config.get().database.instances[rdsId];
        if (!instance) {
            throw new Error(`❌ Database instance not found: ${rdsId}`);
        }
        return instance;
    }
}
