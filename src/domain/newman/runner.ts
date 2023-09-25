import { Collection, CollectionDefinition } from 'postman-collection';
import { NewmanRunSummary } from 'newman';
import { run } from 'newman';

export async function NewmanRunner (
    collection: Collection | CollectionDefinition | string
): Promise<NewmanRunSummary> {
    return new Promise((resolve, reject) => {
        run({
            collection: collection,
            reporters: 'cli'
        }, (err: Error | null, summury: NewmanRunSummary) => {
            if (err) {
                reject(err)
            } else {
                resolve(summury)
            }
        })
    })
}