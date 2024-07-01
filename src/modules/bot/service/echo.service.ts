import { Injectable } from '@nestjs/common'
import { BotService } from '../bot.service'
import { Message } from 'node-telegram-bot-api'

@Injectable()
export class EchoService {
    constructor(private readonly botService: BotService) {
        this.registerCommands()
    }

    private registerCommands() {
        this.botService
            .getBot()
            .onText(/\/echo (.+)/, (msg, match) =>
                this.handleEchoCommand(msg, match)
            )
    }

    private async handleEchoCommand(
        msg: Message,
        match: RegExpExecArray | null
    ) {
        const chatId = msg.chat.id
        const resp = match ? match[1] : ''

        await this.botService.sendMessage(chatId, resp)
    }
}
