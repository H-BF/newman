
export interface ILaunchCreateReq {
    pipeline: number;
    job: number;
    srcBranch: string
    dstBranch: string
    commit: string 
    hbfTag: string
}

export interface ILaunchCreateRes {
    uuid: string
}

export interface ILaunchUpdReq {
    uuid: string
    failCount?: number
    passCount?: number
    duration?: number
    status?: LaunchStatus
}

export interface ILaunchUpdRes {
    uuid: string
    date: Date
    pipeline: number
    job: number
    src_branch: string
    dst_branch: string
    fail_count: number | null
    pass_count: number | null
    duration: number | null
    image: string
    status: LaunchStatus
}


export enum LaunchStatus {
    CREATE =  "create",
    IN_PROCESS = "in_process",
    FINISH = "finish",
    ERROR =  "error"
}