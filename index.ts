import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';
import { Reporter } from './src/domain/reporter/reporter';
import { NewmanDataExtractor } from './src/domain/newman/newmanDataExtractor';
import { Webhook } from './src/domain/telegram/webhook';
import { errorMessage } from './src/domain/telegram/templates';
import { TestDataWriter } from './src/domain/database/testDataWriter';
import fs from 'fs';
import { variables } from './src/init';

let swarm = require('./swarm.json')
let testData = fs.readFileSync('./testdata.sql', 'utf8')

let reporter: Reporter | undefined;

if(Boolean(variables.get("IS_REPORT_BE_SAVED"))) {
    reporter = new Reporter();
} else {
    console.warn(`Results will not be saved!!`)
}

swarm.variable.forEach((vr: any) => {
    if(vr.key === "HOST") {
        vr.value = variables.get("HBF_HOST")
    }
});

const writer = new TestDataWriter();

(async () => {

    const webhook = new Webhook(variables.get("TG_GROUP_ID"));
    const errMsg = webhook.buildMsg(errorMessage, { pipeline: variables.get("CI_PIPELINE_ID") })

    await writer.write(testData)
    await reporter?.startLaunch(
        variables.get("CI_PIPELINE_ID"),
        variables.get("CI_JOB_ID"),
        variables.get("CI_MERGE_REQUEST_SOURCE_BRANCH_NAME"),
        variables.get("CI_MERGE_REQUEST_TARGET_BRANCH_NAME"),
        variables.get("HBF_IMAGE")
    )

    newman.run({
        collection: swarm,
        reporters: 'cli'
    }, async (err: Error | null, summury: NewmanRunSummary) => {
        if (err) {
            console.log(err)
            await reporter?.closeLaunchWithErr(`${err}`)
            await webhook.send(errMsg)
            process.exit(1)
        }
        console.log('collection run complete!')
        
        const nde = new NewmanDataExtractor(summury)
        await reporter?.writeExecutionsData(nde.transformExecutionsData())
        await reporter?.closeLaunch(nde.getAssertionNumber(), nde.getDuration())

        if(summury.run.stats.assertions.failed || summury.run.stats.requests.failed) {
            console.log("exit with error")
            await webhook.send(errMsg)
            process.exit(1)
        }
    })
})();