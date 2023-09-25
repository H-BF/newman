import { Reporter } from './src/domain/reporter/reporter';
import { NewmanDataExtractor } from './src/domain/newman/newmanDataExtractor';
import { AbaControlClient } from './src/domain/grpc/aba.control.client';
import { Status } from './gRPC/control/Status';
import { swarm } from './src/domain/test_data/test-data-preparation';
import { NewmanRunner } from './src/domain/newman/runner';

(async () => {
    console.log("Начинаем API тесты!")
    const control = new AbaControlClient()
    control.sendMsg({ status: Status.ready })

    try {
        const launchUUID = await control.listen()
        const reporter = new Reporter(launchUUID);
      
        swarm.collectJsonSchemas()
        await reporter.writeValidateJsonSchemas(swarm.jsonSchems)
    
        const summury = await NewmanRunner(swarm.scenario)

        const nde = new NewmanDataExtractor(summury)
        await reporter.writeExecutionsData(nde.transformExecutionsData())

        control.sendMsg({
            status: Status.finish,
            data: JSON.stringify({
                fail: nde.getAssertionNumber().failed,
                pass: nde.getAssertionNumber().total - nde.getAssertionNumber().failed
            })
        })
    } catch(err) {
        control.sendMsg({
            status: Status.error,
            data: `${err}`
        })
    } finally {
        control.endStream()
    }
})();