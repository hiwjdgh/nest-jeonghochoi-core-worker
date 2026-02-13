import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseAdapter } from '../database-adapter.interface.js';
import { DatabaseRequestContext } from '../../database.types.js';
import { DatabaseConfigService } from '../../database-config.service.js';
import { DatabaseInstanceConfig } from '../../../config/schemas/database.schema.js';

@Injectable()
export class PostgresqlAdapter implements DatabaseAdapter {
    private pools = new Map<string, Pool>();

    constructor(private readonly databaseConfig: DatabaseConfigService) {}

    private getPool(key: string, config: DatabaseInstanceConfig) {
        if (!this.pools.has(key)) {
            this.pools.set(
                key,
                new Pool({
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password,
                    database: config.database,
                    max: config.poolSize,
                })
            );
        }
        return this.pools.get(key)!;
    }

    async getConnection(
        rdsId: string,
        database?: string
    ): Promise<DatabaseRequestContext> {
        const config = this.databaseConfig.getInstance(rdsId);

        if (config.dbms !== 'postgresql') {
            throw new Error(
                `DBMS mismatch: expected postgresql, got ${config.dbms}`
            );
        }

        const pool = this.getPool(`${rdsId}:${database}`, config);

        return {
            async query(sql, params) {
                const res = await pool.query(sql, params);
                return res.rows;
            },

            async transaction(fn) {
                const client = await pool.connect();
                try {
                    await client.query('BEGIN');
                    const ctx: DatabaseRequestContext = {
                        query: (sql, params) =>
                            client.query(sql, params).then((r) => r.rows),
                        transaction: async () => {
                            throw new Error('Nested transaction not supported');
                        },
                    };
                    const res = await fn(ctx);
                    await client.query('COMMIT');
                    return res;
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            },
        };
    }
}
