import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Message } from 'node-telegram-bot-api'
import Telegram = require('node-telegram-bot-api')

@Injectable()
export class BotService implements OnModuleInit {
    private bot: Telegram

    constructor() {
        const token = process.env.TELEGRAM_TOKEN
        this.bot = new Telegram(token, { polling: true })
    }

    onModuleInit() {
        this.initBot()
    }

    private initBot() {
        this.bot.on('message', async (msg: Message) => {
            const text = msg.text

            switch (text) {
                case '/start':
                    await this.handleStartCommand(msg)
                    break
                case '/help':
                    await this.handleHelpCommand(msg)
                    break
                default:
                    break
            }
        })
    }

    private async handleStartCommand(msg: Message) {
        const chatId = msg.chat.id
        await Logger.log('User tap on /start')
        await this.sendMessage(
            chatId,
            'Привет, это бот компании Bynary.it. Чтобы узнать команды, используйте /help'
        )
    }

    private async handleHelpCommand(msg: Message) {
        const chatId = msg.chat.id
        await Logger.log('User tap on /help')
        await this.sendMessage(
            chatId,
            'Доступные команды: /start, /help, /echo'
        )
    }

    async sendMessage(chatId: number, message: string) {
        try {
            await this.bot.sendMessage(chatId, message)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    // Метод для получения экземпляра Telegram
    getBot(): Telegram {
        return this.bot
    }
}
