import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';
import { Reporter } from './src/domain/reporter/reporter';
import { NewmanDataExtractor } from './src/domain/newman/newmanDataExtractor';
import { swarm } from './src/domain/test_data/test-data-preparation';
import { AbaControlClient } from './src/domain/grpc/aba.control.client';
import { Status } from './gRPC/control/Status';

// let testData = fs.readFileSync('./testdata.sql', 'utf8');

(async () => {
    const control = new AbaControlClient()
    control.sendMsg({ status: Status.ready })

   const launchUUID = await control.listen()
   const reporter = new Reporter(launchUUID);

    swarm.collectJsonSchemas()
    await reporter.writeValidateJsonSchemas(swarm.jsonSchems)

    newman.run({
        collection: swarm.scenario,
        reporters: 'cli'
    }, async (err: Error | null, summury: NewmanRunSummary) => {
        if (err) {
            console.log(err)
            control.sendMsg({
                status: Status.finish,
                data: err.message
            })
            control.endStream()
        }
        
        const nde = new NewmanDataExtractor(summury)
        await reporter.writeExecutionsData(nde.transformExecutionsData())

        control.sendMsg({
            status: Status.finish,
            data: JSON.stringify({
                fail: nde.getAssertionNumber().failed,
                pass: nde.getAssertionNumber().total - nde.getAssertionNumber().failed
            })
        })

        control.endStream()
    })
})();