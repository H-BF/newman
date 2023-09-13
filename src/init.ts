import { MissEnvVariable } from "./errors"

class VariablesStorage {

    private variables: Record<string, string> = {}
    private requiredVariables = [
        "HBF_HOST",
        "HBF_PORT",

        "REPORTER_HOST",
        "REPORTER_PORT",
        "REPORTER_PROTOCOL",
        
        "ABA_CONTROL_IP",
        "ABA_CONTROL_PORT"
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