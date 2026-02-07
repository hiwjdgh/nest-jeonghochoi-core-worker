import { DatabaseRequestContext } from '../database.types.js';

export interface DatabaseAdapter {
    getConnection(
        rdsId: string,
        database?: string
    ): Promise<DatabaseRequestContext>;
}
