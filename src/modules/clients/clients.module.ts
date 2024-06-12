import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Client } from './model/client.model'
import { ClinetService } from './clients.service'
import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { ClientController } from './clients.controller'
import { Project } from '../project/model/project.model'


@Module({
    controllers: [ClientController],
    providers: [ClinetService],
    imports: [
        SequelizeModule.forFeature([User,Project, Client]),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
    ],
    exports: [ClinetService],
})
export class ClientModule {}
