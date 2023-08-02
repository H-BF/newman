import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';
import { Reporter } from './src/domain/database/reporter';
import { NewmanDataExtractor } from './src/domain/newman/newmanDataExtractor';
import { Webhook } from './src/domain/telegram/webhook';
import { errorMessage } from './src/domain/telegram/templates';

let swarm = require('./swarm.json')

if(!process.env.HBF_HOST) {
    throw new Error("Missing environment variable HBF_HOST")
}

swarm.variable.forEach((vr: any) => {
    if(vr.key === "HOST") {
        vr.value = process.env.HBF_HOST
    }
});

const reporter = new Reporter();

(async () => {

    if(!process.env.CI_PIPELINE_ID)
        throw new Error("Missing environment variable CI_PIPELINE_ID")

    if(!process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME)
        throw new Error("Missing environment variable CI_MERGE_REQUEST_SOURCE_BRANCH_NAME")

    if(!process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME)
        throw new Error("Missing environment variable CI_MERGE_REQUEST_TARGET_BRANCH_NAME")

    if(!process.env.HBF_IMAGE)
        throw new Error("Missing environment variable HBF_IMAGE")

    if(!process.env.TG_GROUP_ID)
        throw new Error("Missing environment variable TG_GROUP_ID")

    const webhook = new Webhook(process.env.TG_GROUP_ID);
    const errMsg = webhook.buildMsg(errorMessage, { pipeline: process.env.CI_PIPELINE_ID })

    await reporter.startLaunch(
        process.env.CI_PIPELINE_ID,
        process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME,
        process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME,
        process.env.HBF_IMAGE
    )

    newman.run({
        collection: swarm,
        reporters: 'cli'
    }, async (err: Error | null, summury: NewmanRunSummary) => {
        if (err) {
            console.log(err)
            await reporter.closeLaunchWithErr(`${err}`)
            await webhook.send(errMsg)
            process.exit(1)
        }
        console.log('collection run complete!')
        
        const nde = new NewmanDataExtractor(summury)
        await reporter.writeExecutionsData(nde.transformExecutionsData())
        await reporter.closeLaunch(nde.getAssertionNumber(), nde.getDuration())

        if(summury.run.stats.assertions.failed || summury.run.stats.requests.failed) {
            console.log("exit with error")
            await webhook.send(errMsg)
            process.exit(1)
        }
    })
})();