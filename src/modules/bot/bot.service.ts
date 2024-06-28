import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Message } from 'node-telegram-bot-api'
import Telegram = require('node-telegram-bot-api')

@Injectable()
export class BotService implements OnModuleInit {
    private bot: Telegram

    constructor() {
        const token = process.env.TRLRGRAM_TOKENDEV
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
        const text = msg.text

        if (text === '/start') {
            await this.bot.sendMessage(
                chatId,
                'Ниже появится кнопка, чтобы зайти в CRM',
                {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: 'Зайти в CRM',
                                    web_app: { url: process.env.FRONTURL},
                                },
                            ],
                        ],
                    },
                }
            )

            await this.bot.sendMessage(
                chatId,
                'CRM',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Посмотреть',
                                    web_app: { url:  process.env.FRONTURL },
                                },
                            ],
                        ],
                    },
                }
            )
        }
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
