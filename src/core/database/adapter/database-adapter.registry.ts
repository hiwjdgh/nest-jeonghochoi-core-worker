import { Injectable } from '@nestjs/common';
import { DatabaseAdapter } from './database-adapter.interface.js';

@Injectable()
export class DatabaseAdapterRegistry {
    private adapters = new Map<string, DatabaseAdapter>();

    register(dbms: string, adapter: DatabaseAdapter) {
        this.adapters.set(dbms, adapter);
    }

    get(dbms: string): DatabaseAdapter {
        const adapter = this.adapters.get(dbms);
        if (!adapter) {
            throw new Error(`DB adapter not registered: ${dbms}`);
        }
        return adapter;
    }
}
