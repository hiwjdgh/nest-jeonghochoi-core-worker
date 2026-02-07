export interface DatabaseRequestContext {
    query(sql: string, params?: any): Promise<any>;
    transaction<T>(fn: (tx: DatabaseRequestContext) => Promise<T>): Promise<T>;
}
