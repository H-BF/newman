import { IAssertionReq, TestStatus } from "../../infrastructure/reporter/interfaces/assertion.interface";
import { LaunchStatus } from "../../infrastructure/reporter/interfaces/launch.interface";
import { Method } from "../../infrastructure/reporter/interfaces/request.interface";
import { ReporterClient } from "../../infrastructure/reporter/reporter";
import { IExecution } from "../newman/__interfaces";

export class Reporter {

    private client: ReporterClient
    private launchUuid: string | undefined

    constructor() {
        this.client = new ReporterClient()
    }

    async startLaunch(
        pipeline: string,
        job: string,
        srcBranch: string,
        dstBranch: string,
        image: string
    ) {
        this.launchUuid = await this.client.createLaunch({
            pipeline: Number(pipeline),
            job: Number(job),
            srcBranch: srcBranch,
            dstBranch: dstBranch,
            image: image
        }) 
    }

    async closeLaunch(asser: { total: number, failed: number }, duration: number) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        await this.client.updateLaunch({
            uuid: this.launchUuid,
            failCount: asser.failed,
            passCount: asser.total - asser.failed,
            duration: duration,
            status: LaunchStatus.FINISH
        })
    }

    async closeLaunchWithErr(err: string) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        await this.client.createLaunchError({
            launchUuid: this.launchUuid,
            message: err
        })

        await this.client.updateLaunch({
            uuid: this.launchUuid,
            status: LaunchStatus.ERROR
        })
    }

    async writeExecutionsData(executions: IExecution[]) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        for (const execution of executions) {

            let assertionData: IAssertionReq[] = []

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
                assertionData = assertionData.concat({
                    name: assertion.name,
                    executionUuid: executionUuid,
                    errorMessage: assertion.err_msg || null,
                    status: assertion.status.toLowerCase() as TestStatus
                })
            }

            await this.client.createAssertions(assertionData)
        }
    }
}