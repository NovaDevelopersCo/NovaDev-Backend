import { Module } from '@nestjs/common'
import { BotService } from './bot.service'
import { EchoService } from './service/echo.service'
import { WebAppService } from './service/webapp.service'
import { WebUserService } from './service/webuser.service'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [UsersModule, AuthModule],
    providers: [BotService, EchoService, WebAppService, WebUserService],
    exports: [BotService],
})
export class BotModule {}
