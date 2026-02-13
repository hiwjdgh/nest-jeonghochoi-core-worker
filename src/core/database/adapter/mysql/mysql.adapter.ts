import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { DatabaseAdapter } from '../database-adapter.interface.js';
import { DatabaseRequestContext } from '../../database.types.js';
import { DatabaseConfigService } from '../../database-config.service.js';
import { DatabaseInstanceConfig } from '../../../config/schemas/database.schema.js';

@Injectable()
export class MysqlAdapter implements DatabaseAdapter {
    private pools = new Map<string, Pool>();

    constructor(private readonly databaseConfig: DatabaseConfigService) {}

    private getPool(key: string, config: DatabaseInstanceConfig) {
        if (!this.pools.has(key)) {
            this.pools.set(
                key,
                createPool({
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password,
                    database: config.database,
                    connectionLimit: config.poolSize,
                    waitForConnections: true,
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

        if (config.dbms !== 'mysql') {
            throw new Error(
                `DBMS mismatch: expected mysql, got ${config.dbms}`
            );
        }

        const pool = this.getPool(`${rdsId}:${database}`, config);

        return {
            async query(sql, params) {
                const [rows] = await pool.query(sql, params);
                return rows;
            },

            async transaction(fn) {
                const conn = await pool.getConnection();
                try {
                    await conn.beginTransaction();
                    const ctx: DatabaseRequestContext = {
                        query: (sql, params) =>
                            conn.query(sql, params).then((r) => r[0]),
                        transaction: async () => {
                            throw new Error('Nested transaction not supported');
                        },
                    };
                    const res = await fn(ctx);
                    await conn.commit();
                    return res;
                } catch (e) {
                    await conn.rollback();
                    throw e;
                } finally {
                    conn.release();
                }
            },
        };
    }
}
