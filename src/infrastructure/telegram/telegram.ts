import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';

export class Telegram {

    private bot: TelegramBot

    constructor() {
        if(!process.env.TG_TOKEN)
            throw new Error("Missing environment variable TG_TOKEN")
        
        this.bot = new TelegramBot(process.env.TG_TOKEN, { polling: true })
    }

    async sendMessage(
        chatID: string | number,
        msg: string,
        options?: SendMessageOptions
    ): Promise<Message> {
        return await this.bot.sendMessage(chatID, msg, options)
    }
}