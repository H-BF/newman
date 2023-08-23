import { MissEnvVariable } from "./errors"

class VariablesStorage {

    private variables: Record<string, string> = {}
    private requiredVariables = [
        "HBF_HOST",
        "IS_REPORT_BE_SAVED",
        "REPORTER_HOST",
        "REPORTER_PORT",
        "REPORTER_PROTOCOL",
        "CI_PIPELINE_ID",
        "CI_JOB_ID",
        "CI_MERGE_REQUEST_SOURCE_BRANCH_NAME",
        "CI_MERGE_REQUEST_TARGET_BRANCH_NAME",
        "TG_TOKEN",
        "TG_GROUP_ID",
        "HBF_IMAGE",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_HOST",
        "POSTGRES_PORT",
        "POSTGRES_DB"
    ]

    constructor() {
        let errors: string[] = []
        this.requiredVariables.forEach(variable => {
            if (!process.env[variable]) {
                errors.push(variable)
                return
            }
            this.variables[variable] = process.env[variable]!
        })
        if(errors.length > 0)
            throw new MissEnvVariable(errors.join(", "))
    }

    get(name: string): string {
        if (!(name in this.variables))
            throw new Error(`Переменная ${name} отсутствует в хранилище`)

        return this.variables[name]
    }
}

export const variables = new VariablesStorage()