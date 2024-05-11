import { forwardRef, Module } from '@nestjs/common'
import { TariffService } from './tariff.service'
import { TariffController } from './tariff.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Tariff } from './model/tariff.model'
import { User } from '../users/model/users.model'
import { AuthModule } from '../auth/auth.module'

@Module({
    providers: [TariffService],
    controllers: [TariffController],
    imports: [
        SequelizeModule.forFeature([Tariff, User]),
        forwardRef(() => AuthModule),
    ],
    exports: [TariffService],
})
export class TariffModule {}
