import { Client, QueryResultRow } from 'pg';

export class DBClient {
    
    private client: Client

    constructor(
        user?: string,
        pwd?: string,
        host?: string,
        port?: number,
        database?: string
    ) {
        this.client = new Client({
            user: user,
            password: pwd,
            host: host,
            port: port,
            database: database
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