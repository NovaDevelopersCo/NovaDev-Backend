import { Module } from '@nestjs/common'
import { BotService } from './bot.service'
import { EchoService } from './echo.service'

@Module({
    providers: [BotService, EchoService],
    exports: [BotService],
})
export class BotModule {}
