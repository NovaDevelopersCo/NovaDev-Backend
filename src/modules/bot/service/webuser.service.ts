/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common'
import { UsersService } from '../../users/users.service'
import { AuthService } from '../../auth/auth.service'
const schedule = require('node-schedule')

@Injectable()
export class WebUserService {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) {}
    private async addTdIdUser(bot, chatId, email, userTgId) {
        try {
            const user = await this.userService.getUserByEmail(email)
            if (!user) {
                return await bot.sendMessage(
                    chatId,
                    `Пользователь с email ${email} не найден`
                )
            }

            if (user.tg_id === null) {
                user.tg_id = userTgId
                await user.save()
                return await bot.sendMessage(
                    chatId,
                    `Вы успешно привязали телеграм к аккаунту`
                )
            } else {
                return await bot.sendMessage(
                    chatId,
                    `Этот аккаунт уже привязан к телеграму`
                )
            }
        } catch (error) {
            console.error('Error in addTdIdUser:', error)
            return await bot.sendMessage(
                chatId,
                `Произошла ошибка при привязке телеграма к аккаунту. Пожалуйста, попробуйте позже.`
            )
        }
    }

    async signIn(bot, chatId, data, userTgId) {
        console.log(data)
        console.log(userTgId)
        const token = await this.authService.login(data)
        console.log(token)
        if (!token) {
            return await bot.sendMessage(chatId, `Некоректные данные`)
        }
        await bot.sendMessage(chatId, `Вы успешно вошли в аккаунт!`, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Все мои задачи',
                            web_app: {
                                url: process.env.URL + '/admin/autorization',
                            },
                        },
                        {
                            text: 'Добавить задачу',
                            web_app: {
                                url: process.env.URL + '/admin/autorization',
                            },
                        },
                    ],
                    [
                        {
                            text: 'Изменить мой профиль',
                            web_app: {
                                url: process.env.URL + '/admin/autorization',
                            },
                        },
                        {
                            text: 'Показать мой профиль',
                            web_app: {
                                url: process.env.URL + '/admin/autorization',
                            },
                        },
                    ],
                ],
            },
        })
        const email = data.private_nickname
        await this.addTdIdUser(bot, chatId, email, userTgId)
        schedule.scheduleJob(
            +new Date() +
                1000 *
                    60 *
                    60 *
                    24 *
                    Number(process.env.JWT_EXPIRES_TIME.slice(0, -1)),
            async () => {
                await this.badToken(bot, chatId)
            }
        )
        return await bot.sendMessage(
            chatId,
            `Отлично! Теперь можно начинать работу`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Что я могу делать?',
                                callback_data: 'all_commands',
                            },
                        ],
                    ],
                },
            }
        )
    }

    async badToken(bot, chatId) {
        const message = await bot.sendMessage(
            chatId,
            `К сожалению, срок действия авторизации истек. Пожалуйста, войдите в аккаунт снова.`,
            {
                reply_markup: JSON.stringify({
                    keyboard: [
                        [
                            {
                                text: 'Войти в аккаунт',
                                web_app: {
                                    url:
                                        process.env.URL + '/admin/autorization',
                                },
                            },
                        ],
                    ],
                }),
            }
        )
        const batchSize = 80
        const result = []
        let currentNumber = message.message_id - 1
        while (currentNumber >= 1) {
            const batch = Array.from(
                { length: batchSize },
                (_, index) => currentNumber - index
            )
            result.push(batch)
            currentNumber -= batchSize
        }
        for (let i = 0; i < result.length; i++) {
            try {
                await bot.deleteMessages(chatId, result[i])
            } catch (error) {}
        }
    }
}
