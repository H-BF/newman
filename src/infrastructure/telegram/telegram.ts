import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { variables } from '../../init';

export class Telegram {

    private bot: TelegramBot

    constructor() {
        this.bot = new TelegramBot(variables.get("TG_TOKEN"), { polling: true })
    }

    async sendMessage(
        chatID: string | number,
        msg: string,
        options?: SendMessageOptions
    ): Promise<Message> {
        return await this.bot.sendMessage(chatID, msg, options)
    }
}