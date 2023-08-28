import { variables } from '../../init';
import { IVariable } from './interfaces/variable.interface';

class TestDataPreparation {

    scenario: any
    jsonSchems: Record<string, string> = {}

    constructor() {
        this.scenario = require('../../../swarm.json')
        this.scenario.variable.forEach((vr: any) => {
            if(vr.key === "HOST") {
                vr.value = variables.get("HBF_HOST")
            }
        });
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