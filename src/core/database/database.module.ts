import { Global, Module } from '@nestjs/common';
import { DatabaseAdapterRegistry } from './adapter/database-adapter.registry.js';
import { MssqlAdapter } from './adapter/mssql/mssql.adapter.js';
import { MysqlAdapter } from './adapter/mysql/mysql.adapter.js';
import { PostgresqlAdapter } from './adapter/postgresql/postgresql.adapter.js';
import { DatabaseConfigService } from './database-config.service.js';

@Global()
@Module({
    providers: [
        DatabaseConfigService,
        DatabaseAdapterRegistry,
        MssqlAdapter,
        MysqlAdapter,
        PostgresqlAdapter,
    ],
    exports: [DatabaseAdapterRegistry],
})
export class DatabaseModule {
    constructor(
        registry: DatabaseAdapterRegistry,
        mssql: MssqlAdapter,
        mysql: MysqlAdapter,
        postgresql: PostgresqlAdapter
    ) {
        registry.register('mssql', mssql);
        registry.register('mysql', mysql);
        registry.register('postgresql', postgresql);
    }
}
