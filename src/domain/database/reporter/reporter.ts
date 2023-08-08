import { IExecution } from "../../newman/__interfaces";
import { ReporterCRUD } from "./reporterCRUD";

export class Reporter {

    private crud: ReporterCRUD
    private launchUuid: string | undefined

    constructor() {
        this.crud = new ReporterCRUD()
    }

    async startLaunch(
        pipeline: string,
        src_branch: string,
        dst_branch: string,
        image: string
    ) {
        await this.crud.connect()
        this.launchUuid = await this.crud.createLaunch([
            pipeline,
            src_branch,
            dst_branch,
            null,
            null,
            null,
            image,
            'in_process'
        ])
    }

    async closeLaunch(asser: { total: number, failed: number }, duration: number) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')

        await this.crud.updateLaunch(this.launchUuid, {
            fail: asser.failed,
            pass: asser.total - asser.failed,
            duration: duration,
            status: "finish"
        })
        await this.crud.close()
    }

    async closeLaunchWithErr(err: string) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')
        
        await this.crud.createLaunchError([this.launchUuid, err])
        await this.crud.updateLaunch(this.launchUuid, { status: "error" })
        await this.crud.close()
    }

    async writeExecutionsData(executions: IExecution[]) {
        if (!this.launchUuid)
            throw new Error('Missing launch uuid! Start thr launch.')
        
        for (const execution of executions) {
            const execUuid = await this.crud.createExecutions([
                execution.name,
                this.launchUuid,
                null,
                null
            ])

            const requestUuid = await this.crud.createRequest([
                execution.request.method,
                execution.request.url,
                execution.request.header,
                execution.request.body
            ])

            const responseUuid = await this.crud.createResponse([
                execution.response.status,
                execution.response.code,
                execution.response.header,
                execution.response.body
            ])

            await this.crud.updateExecutions(execUuid, {
                request_uuid: requestUuid,
                response_uuid: responseUuid
            })

            for (const assertion of execution.assertions) {
                await this.crud.createAssertion([
                    assertion.name,
                    execUuid,
                    assertion.err_msg,
                    assertion.status
                ])
            }
        }
    }
}