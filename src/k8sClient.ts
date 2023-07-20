import { KubeConfig, Watch, V1Pod  } from '@kubernetes/client-node';

class K8sClient {

    private config: KubeConfig

    constructor() {
        this.config = new KubeConfig()
        this.config.loadFromDefault()
    }

    async waitPodStatus (
        namespace: string,
        podLabel: string,
        podStatus: string
    ): Promise<void> {
        const watch = new Watch(this.config)
       return new Promise<void>(async (resolve, reject) => {
            await watch.watch(
                `/api/v1/namespaces/${namespace}/pods`,
                { labelSelector: podLabel },
                (_, apiObj: V1Pod) => {
                    if (apiObj.status?.phase === podStatus) {
                        resolve()
                    }
                },
                (err) => {
                    console.log(err)
                    reject(err)
                }
            )
        })
    }
};

const k8sClient = new K8sClient();

export {
    k8sClient
}