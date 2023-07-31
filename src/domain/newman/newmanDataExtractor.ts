import { NewmanRunExecution, NewmanRunSummary } from "newman";



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


    getDataFromExecutions() {
        const executions = this.report.run.executions
        for (let i = 0; i < 1; i++) {
            const e = executions[i]
            console.log(`METHOD: ${e.request.method}`)
            console.log(this.buildURL(e))
            console.log(e.request.getHeaders())
            console.log(e.request.body?.raw)
        }    
    }

    private buildURL(execution: NewmanRunExecution): string {
        const url = execution.request.url
        return `${url.protocol}://${url.getHost()}:${url.port}${url.getPath()}`
    }
}