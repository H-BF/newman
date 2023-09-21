import { IVariable } from './interfaces/variable.interface';
import fs from 'fs'

class TestDataPreparation {

    scenario: any
    jsonSchems: Record<string, string> = {}

    constructor() {
        this.scenario = JSON.parse(
            fs.readFileSync('/tmp/testData/swarm.json', 'utf-8')
        ) 
    }

    collectJsonSchemas() {
        this.scenario.variable.forEach((vr: IVariable) => {
            if(vr.key.includes('JsonSchema')) {
                this.jsonSchems[vr.key] = vr.value
            }
        })
    }
}

export const swarm = new TestDataPreparation()