import * as newman from 'newman';
import { NewmanRunSummary } from 'newman';
import { k8sClient } from './src/k8sClient';
import { testData } from './src/testDataGenerator';

let swarm = require('./swarm.json')

if(!process.env.HBF_HOST) {
    throw new Error("Missing environment variable HBF_HOST")
}

swarm.variable.forEach((vr: any) => {
    if(vr.key === "HOST") {
        vr.value = process.env.HBF_HOST
    }
});

<<<<<<< index.ts
(async () => {    
=======
(async () => {
    
    try {
        await k8sClient.waitPodStatus('default', 'app.kubernetes.io/name=hbf-server', 'Running')
        await testData.generate()
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
    
>>>>>>> index.ts
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