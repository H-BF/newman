import { DBClient } from "../../infrastructure/database/DBClient"
import { variables } from "../../init"

export class TestDataWriter {

    private client: DBClient

    constructor() {
        this.client = new DBClient(
            variables.get("POSTGRES_USER"),
            variables.get("POSTGRES_PASSWORD"),
            variables.get("POSTGRES_HOST"),
            Number(variables.get("POSTGRES_PORT")),
            variables.get("POSTGRES_DB")
        )
    }

    async write(sql: string) {
        await this.client.connect()
        await this.client.query(sql)
        await this.client.close()
    }
}