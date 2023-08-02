import { Telegram } from "../../infrastructure/telegram/telegram"
import mustache from 'mustache';

export class Webhook {

    private chatID: string | number
    private bot: Telegram

    constructor(chatID: string | number) {
        this.chatID = chatID
        this.bot = new Telegram()
    }

    buildMsg (
        template: string,
        values: any
    ): string {
        return mustache.render(template, values)
    }

    async send(message: string) {
        try {
            await this.bot.sendMessage(
                this.chatID,
                message,
                { parse_mode: 'Markdown' }
            )
        } catch (err: any) {
            console.log(`${err.message}`)
        } 
    }
}