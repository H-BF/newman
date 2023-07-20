import axios from 'axios';
import { networks, rules, sg } from '../testData';

class TestData {

    async generate() {
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
    }
}

const testData = new TestData()

export {
    testData
}



