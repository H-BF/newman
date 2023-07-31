import { DBClient } from "../../infrastructure/database/DBClient"

export class ReporterCRUD {

    private client: DBClient

    constructor() {
        this.client = new DBClient()
    }

    async connect() {
        await this.client.connect()
    }

    async close() {
        await this.client.close()
    }

    async createLaunch(): Promise<string> {
        const data = await this.client.query<{uuid: string}>(
            `INSERT INTO launch DEFAULT VALUES RETURNING uuid;`
        )
        return data[0].uuid
    }

    async updateLaunch(launchUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [launchUuid, ...Object.values(data)];
        await this.client.query(`UPDATE launch SET ${fields} WHERE uuid = $1;`, values)
    }

    async createLaunchError(values: any[]) {
        await this.client.query(
            `
            INSERT INTO launch_error (
                launch_uuid,
                message
            ) VALUES ($1, $2);
            `
            , values
        )
    }

    async updateLaunchError(launchErrorUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [launchErrorUuid, ...Object.values(data)];
        await this.client.query(`UPDATE launch_error SET ${fields} WHERE uuid = $1;`, values)
    }

    async createExecutions(values: any[]) {
        const data = await this.client.query(
            `
            INSERT INTO executions (
                name,
                launch_uuid,
                request_uuid,
                response_uuid,
                assertion_number,
                assertion_fail
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING uuid;
            `,
            values
        )
        return data[0].uuid
    } 

    async updateExecutions(execUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [execUuid, ...Object.values(data)];
        await this.client.query(`UPDATE executions SET ${fields} WHERE uuid = $1;`, values)
    }

    async createRequest(values: any[]): Promise<string> {
        const rows = await this.client.query<{ uuid: string }>(
            `
            INSERT INTO request (
                method,
                url,
                header,
                body
            ) VALUES ($1, $2, $3, $4)
            RETURNING uuid;
            `,
            values
        )
        return rows[0].uuid
    }

    async updateRequest(requestUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [requestUuid, ...Object.values(data)];
        await this.client.query(`UPDATE request SET ${fields} WHERE uuid = $1;`, values)
    }

    async createResponse(values: any[]): Promise<string> {
        const rows = await this.client.query<{ uuid: string }>(
            `
            INSERT INTO response (
                status,
                code,
                header,
                body
            ) VALUES ($1, $2, $3, $4)
            RETURNING uuid;
            `,
            values
        )
        return rows[0].uuid
    }

    async updateResponse(responseUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [responseUuid, ...Object.values(data)];
        await this.client.query(`UPDATE response SET ${fields} WHERE uuid = $1;`, values)
    }

    async createAssertion(values: any[]): Promise<string > {
        const rows = await this.client.query(
            `
            INSERT INTO assertion (
                name,
                execution_uuid,
                error_message,
                status
            ) VALUES ($1, $2, $3, $4)
            RETURNING uuid;
            `, 
            values
        )
        return rows[0].uuid
    }

    async updateAssertion(assertionUuid: string, data: Record<string, any>) {
        const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [assertionUuid, ...Object.values(data)];
        await this.client.query(`UPDATE assertion SET ${fields} WHERE uuid = $1;`, values)
    }
}