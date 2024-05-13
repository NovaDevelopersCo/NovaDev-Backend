import { Module, forwardRef } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from './model/users.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Role } from 'src/modules/roles/model/roles.model'
import { RolesModule } from 'src/modules/roles/roles.module'
import { AuthModule } from 'src/modules/auth/auth.module'
import { Team } from '../teams/model/teams.model'
import { TeamsModule } from '../teams/teams.module'

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, Team]),
        RolesModule,
        TeamsModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
