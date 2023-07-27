import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';

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
    }, (err: Error | null, summury: NewmanRunSummary) => {
        if (err) {
            console.log(err)
        }
        console.log('collection run complete!') 

        if(summury.run.stats.assertions.failed || summury.run.stats.requests.failed) {
            console.log("exit with error")
            process.exit(1)
        }
    })
})();