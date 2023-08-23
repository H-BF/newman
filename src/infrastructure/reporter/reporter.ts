import { variables } from "../../init";
import { RestClient } from "../axios/rest-client";
import { IAssertionReq, IAssertionRes } from "./interfaces/assertion.interface";
import { IExecutionReq, IExecutionRes } from "./interfaces/execution.interface";
import { ILaunchErrReq } from "./interfaces/launch-error.interface";
import { ILaunchCreateReq, ILaunchCreateRes, ILaunchUpdReq, ILaunchUpdRes } from "./interfaces/launch.interface";
import { IRequestReq, IRequestRes } from "./interfaces/request.interface";
import { IResponseReq, IResponseRes } from "./interfaces/response.interface";

export class ReporterClient extends RestClient {

    constructor() {

        super(
            variables.get("REPORTER_HOST"),
            variables.get("REPORTER_PORT"),
            variables.get("REPORTER_PROTOCOL"),
        )
        this.defaults.baseURL += '/v1'
    }

    async createLaunch(launch: ILaunchCreateReq): Promise<string> {
        const { data } = await this.post<ILaunchCreateRes>('/launch', launch)
        return data.uuid
    }

    async updateLaunch(launch: ILaunchUpdReq): Promise<ILaunchUpdRes> {
        const { data } = await this.patch<ILaunchUpdRes>('/launch', launch)
        return data
    }

    async createRequest(request: IRequestReq): Promise<string> {
        const { data } =  await this.post<IRequestRes>('/request', request)
        return data.uuid
    }

    async createResponse(response: IResponseReq): Promise<string> {
        const { data } = await this.post<IResponseRes>('/response', response)
        return data.uuid
    }

    async createExecution(execution: IExecutionReq): Promise<string> {
        const { data } = await this.post<IExecutionRes>('/execution', execution)
        return  data.uuid
    }

    async createAssertions(assertions: IAssertionReq[]): Promise<number> {
        const { data } = await this.post<IAssertionRes>('/assertions', assertions)
        return data.count
    }

    async createLaunchError(launchError: ILaunchErrReq): Promise<void> {
        await this.post('/launch_error', launchError)
    }
}