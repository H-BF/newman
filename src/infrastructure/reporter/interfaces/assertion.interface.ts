export interface IAssertionReq {
    name: string
    executionUuid: string
    errorMessage: string | null
    status: TestStatus
}

export interface IAssertionRes {
    count: number
}

export enum TestStatus {
    FAIL = 'fail',
    PASS = 'pass'
}