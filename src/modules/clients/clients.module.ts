import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Client } from './model/client.model'
import { ClientService } from './clients.service'
import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { ClientController } from './clients.controller'
import { Project } from '../project/model/project.model'

@Module({
    controllers: [ClientController],
    providers: [ClientService],
    imports: [
        SequelizeModule.forFeature([User, Project, Client]),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
    ],
    exports: [ClientService],
})
export class ClientModule {}
