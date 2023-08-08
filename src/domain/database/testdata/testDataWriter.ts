import { DBClient } from "../../../infrastructure/database/DBClient"

export class TestDataWriter {

    private client: DBClient

    constructor() {
        this.client = new DBClient(
            process.env.POSTGRES_USER,
            process.env.POSTGRES_PASSWORD,
            process.env.POSTGRES_HOST,
            Number(process.env.POSTGRES_PORT),
            process.env.POSTGRES_DB
        )
    }

    async write(sql: string) {
        await this.client.connect()
        await this.client.query(sql)
        await this.client.close()
    }
}