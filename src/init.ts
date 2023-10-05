import { logger } from "./domain/logger/logger.service"
import { MissEnvVariable } from "./errors"

class VariablesStorage {

    private variables: Record<string, string> = {}
    private requiredVariables = [
        "ABA_CONTROL_IP",
        "ABA_CONTROL_PORT",
        "ABA_CONTORL_PROXY_PORT",
        "ABA_CONTORL_PROXY_PROTOCOL"
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

function initVariableStorage(): VariablesStorage {
    try {
        return new VariablesStorage()
    } catch(err) {
        logger.error(err)
        process.exit(1)
    }
}

export const variables = initVariableStorage()