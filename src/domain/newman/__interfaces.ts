export interface ILaunch {
    failed: number
    passed: number
    duration: number
    executions: IExecution[]
}

export interface IExecution {
    name: string
    status: string
    request: IRequest
    response: IResponse
    assertions: IAssertion[]
}

export interface IRequest {
    method: string
    url: string
    header: JSON
    body: JSON
}

export interface IResponse {
    status: string
    code: number
    header: JSON
    body: JSON
}

export interface IAssertion {
    name: string
    err_msg: string
    status: string
}
