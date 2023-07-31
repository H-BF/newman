import { Client, PoolClient, QueryResult, QueryResultRow } from 'pg';

export class DBClient {
    
    private client: Client

    constructor() {
        this.client = new Client({
            user: process.env.REPORTER_DB_USER,
            password: process.env.REPORTER_DB_PWD,
            host: process.env.REPORTER_DB_HOST,
            port: Number(process.env.REPORTER_DB_PORT),
            database: process.env.REPORTER_DB_NAME
        })
    }

    async query<T extends QueryResultRow>(sql: string, values?: any[]): Promise<T[]> {
        if (!this.client)
            throw new Error("Please connect to PostgreSQL.")
        try {
            const { rows }  = await this.client.query<T>(sql, values)
            return rows
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    async connect() {
        await this.client.connect()
        await this.client.query(`SET search_path TO ${process.env.REPORTER_DB_SCHEMA}`)
    }

    async close() {
        await this.client.end()
    }
}