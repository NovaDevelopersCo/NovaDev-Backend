import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Message } from 'node-telegram-bot-api'
import Telegram = require('node-telegram-bot-api')
import { WebAppService } from './service/webapp.service'

@Injectable()
export class BotService implements OnModuleInit {
    private bot: Telegram
    private readonly logger = new Logger(BotService.name)

    constructor(private readonly webAppService: WebAppService) {
        const token = process.env.TELEGRAM_TOKEN
        this.bot = new Telegram(token, { polling: true })
    }

    onModuleInit() {
        this.initBot()
    }

    private initBot() {
        this.bot.on('message', async (msg: Message) => {
            const text = msg.text
            const chatId = msg.chat.id

            switch (text) {
                case '/start':
                    await this.handleStartCommand(msg)
                    break
                case '/help':
                    await this.handleHelpCommand(msg)
                    break
                default:
                    if (msg?.web_app_data?.data) {
                        try {
                            await this.webAppService.agree(
                                this.bot,
                                chatId,
                                msg
                            )
                        } catch (e) {
                            this.logger.error(
                                'Error processing web_app_data',
                                e
                            )
                        }
                    }
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
                                    web_app: { url: process.env.FRONTURL },
                                },
                            ],
                        ],
                    },
                }
            )

            await this.bot.sendMessage(chatId, 'CRM', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Посмотреть',
                                web_app: { url: process.env.FRONTURL },
                            },
                        ],
                    ],
                },
            })
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
