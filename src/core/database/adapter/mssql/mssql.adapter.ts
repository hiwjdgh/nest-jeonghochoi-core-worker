import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as mssql from 'mssql';
import { DatabaseAdapter } from '../database-adapter.interface.js';
import { DatabaseRequestContext } from '../../database.types.js';
import { DatabaseConfigService } from '../../database-config.service.js';
import { DatabaseInstanceConfig } from '../../../config/schemas/database.schema.js';

@Injectable()
export class MssqlAdapter implements DatabaseAdapter, OnModuleDestroy {
    private pools = new Map<string, mssql.ConnectionPool>();

    constructor(private readonly databaseConfig: DatabaseConfigService) {}

    private async getPool(
        key: string,
        config: DatabaseInstanceConfig,
        database?: string
    ) {
        if (!this.pools.has(key)) {
            const pool = await new mssql.ConnectionPool({
                user: config.user,
                password: config.password,
                server: config.host,
                port: config.port,
                database: database ?? config.database,
                options: { encrypt: false },
            }).connect();
            this.pools.set(key, pool);
        }
        return this.pools.get(key)!;
    }

    async getConnection(
        rdsId: string,
        database?: string
    ): Promise<DatabaseRequestContext> {
        const config = this.databaseConfig.getInstance(rdsId);

        if (config.dbms !== 'mssql') {
            throw new Error(
                `DBMS mismatch: expected mssql, got ${config.dbms}`
            );
        }

        const dbName = database ?? config.database ?? '';
        const pool = await this.getPool(`${rdsId}:${dbName}`, config, database);

        return {
            async query(sql, params) {
                const req = pool.request();
                if (params) {
                    for (const [k, v] of Object.entries(params)) {
                        req.input(k, v as any);
                    }
                }
                const result = await req.query(sql);
                return result.recordset;
            },

            async transaction(fn) {
                const tx = new mssql.Transaction(pool);
                await tx.begin();
                try {
                    const ctx: DatabaseRequestContext = {
                        async query(sql, params) {
                            const req = new mssql.Request(tx);
                            if (params) {
                                for (const [k, v] of Object.entries(params)) {
                                    req.input(k, v as any);
                                }
                            }
                            const result = await req.query(sql);
                            return result.recordset;
                        },
                        transaction: async () => {
                            throw new Error('Nested transaction not supported');
                        },
                    };
                    const res = await fn(ctx);
                    await tx.commit();
                    return res;
                } catch (e) {
                    await tx.rollback();
                    throw e;
                }
            },
        };
    }

    async onModuleDestroy() {
        await Promise.all(
            [...this.pools.values()].map(async (pool) => {
                await pool.close();
            })
        );
        this.pools.clear();
    }
}
