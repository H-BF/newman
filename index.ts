import axios from 'axios';
import * as newman from 'newman';
import { networks, rules, sg } from './testData';

let swarm = require('./swarm.json')

if(!process.env.HBF_HOST) {
    throw new Error("Missing environment variable HBF_HOST")
}

swarm.variable.forEach((vr: any) => {
    if(vr.key === "HOST") {
        vr.value = process.env.HBF_HOST
    }
});

async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {

    await sleep(15000)

    await axios.post(`http://${process.env.HBF_HOST}/v1/sync`, JSON.stringify(networks), {
        headers: {
            "Content-Type": "application/json"
        }
    })

    await axios.post(`http://${process.env.HBF_HOST}/v1/sync`, JSON.stringify(sg), {
        headers: {
            "Content-Type": "application/json"
        }
    })

    await axios.post(`http://${process.env.HBF_HOST}/v1/sync`, JSON.stringify(rules), {
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    newman.run({
        collection: swarm,
        reporters: 'cli'
    }, (err) => {
        if (err) {
            console.log(err)
        }
        console.log('collection run complete!')
    })
})();