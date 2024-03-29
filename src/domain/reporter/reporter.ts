import { IAssertionReq, TestStatus } from "../../infrastructure/reporter/interfaces/assertion.interface";
import { Method } from "../../infrastructure/reporter/interfaces/request.interface";
import { ReporterClient } from "../../infrastructure/reporter/reporter";
import { IExecution } from "../newman/__interfaces";

export class Reporter {

    private client: ReporterClient
    private launchUuid: string
    private jsonSchemas: Record<string, string> = {}

    constructor(launchUuid: string) {
        this.launchUuid = launchUuid
        this.client = new ReporterClient()
    }

    async writeValidateJsonSchemas(data: Record<string, string>) {

        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        Object.entries(data).forEach(async ([key, value]) => {
            const uuid = await this.client.createJsonSchema({
                name: key,
                launchUuid: this.launchUuid!,
                schema: value
            })
            this.jsonSchemas[key] = uuid
        })
    }

    async writeExecutionsData(executions: IExecution[]) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        for (const execution of executions) {

            let assertionData: IAssertionReq[] = []
            let failCount: number = 0
            let passCount: number = 0

            const requestUuid = await this.client.createRequest({
                method: execution.request.method as Method,
                url: execution.request.url,
                header: JSON.stringify(execution.request.header),
                body: JSON.stringify(execution.request.body)
            })

            const responseUuid = await this.client.createResponse({
                status: execution.response.status,
                code: execution.response.code,
                header: JSON.stringify(execution.response.header),
                body: JSON.stringify(execution.response.body)
            })

            const executionUuid = await this.client.createExecution({
                name: execution.name,
                launchUuid: this.launchUuid,
                requestUuid: requestUuid,
                responseUuid: responseUuid
            })

            for (const assertion of execution.assertions) {
                const status = assertion.status.toLowerCase() as TestStatus
                assertionData = assertionData.concat({
                    name: assertion.name,
                    executionUuid: executionUuid,
                    errorMessage: assertion.err_msg || null,
                    jsonSchema: this.jsonSchemas[assertion.schema] || null,
                    status: status
                })

                switch (status) {
                    case 'pass':
                        passCount++;
                        break;
                    case 'fail':
                        failCount++;
                        break
                }
            }

            await this.client.updateExecution({
                uuid: executionUuid,
                failCount: failCount,
                passCount: passCount
            })

            await this.client.createAssertions(assertionData)
        }
    }
}