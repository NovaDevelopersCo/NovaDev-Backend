import { Module, forwardRef } from '@nestjs/common'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Team } from './model/teams.model'
import { FilesModule } from '../files/files.module'
import { AuthModule } from '../auth/auth.module'

@Module({
    providers: [TeamsService],
    controllers: [TeamsController],
    imports: [
        SequelizeModule.forFeature([User, Team]),
        FilesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [TeamsService],
})
export class TeamsModule {}
