import { NewmanRunSummary } from "newman";
import { ExecutionDataExecutor } from "./executionDataExtractor";
import { IExecution } from "./__interfaces";

export class NewmanDataExtractor {

    private report: NewmanRunSummary

    constructor(report: NewmanRunSummary) {
        this.report = report
    }   

    getDuration(): number {
        let start = this.report.run.timings.started
        let finish = this.report.run.timings.completed
        if (!start || !finish) {
            throw new Error("Нельзя вычислить длительность. Отсутствуют данные")
        }
        return finish - start
    }

    getAssertionNumber(): { total: number, failed: number } {
        const asser = this.report.run.stats.assertions
        return { total: asser.total || 0, failed: asser.failed || 0 }
    }

    transformExecutionsData(): IExecution[] {
        let result: IExecution[] = []
        this.report.run.executions.forEach( execution => {
            const exec = new ExecutionDataExecutor(execution)
            result.push({
                name: exec.getName(),
                status: exec.getStatus(),
                request: exec.getRequestData(),
                response: exec.getResponseData(),
                assertions: exec.getAssertionsData()
            })
        })
        return result
    }
}