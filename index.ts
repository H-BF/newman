import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';
import { ReporterCRUD } from './src/domain/database/reporter';

let swarm = require('./swarm.json')

if(!process.env.HBF_HOST) {
    throw new Error("Missing environment variable HBF_HOST")
}

swarm.variable.forEach((vr: any) => {
    if(vr.key === "HOST") {
        vr.value = process.env.HBF_HOST
    }
});

(async () => {    
    newman.run({
        collection: swarm,
        reporters: 'cli'
    }, async (err: Error | null, summury: NewmanRunSummary) => {
        if (err) {
            console.log(err)
        }
        console.log('collection run complete!') 

        if(summury.run.stats.assertions.failed || summury.run.stats.requests.failed) {
            
            const reporter = new ReporterCRUD()
            await reporter.connect()
            const launchUuid = await reporter.createLaunch()
            const executionUuid = await reporter.createExecutions(["fuck", launchUuid, null, null, 56, 67])
            const requestUuid = await reporter.createRequest(["POST", "http://puck.ru:8080", '{"content-type": "json"}', '{"have": [{"moo": "boo"}]}'])
            const responseUuid = await reporter.createResponse(["OK", 200, '{"content-type": "json"}', '{"have": [{"moo1": "boo1"}]}'])

            reporter.updateExecutions(executionUuid, { "request_uuid": requestUuid, "response_uuid": responseUuid })

            await reporter.createAssertion(["assertion", executionUuid, "ERROR", "FAILED"])

            await reporter.close()

            console.log("exit with error")
            process.exit(1)
        }
    })
})();