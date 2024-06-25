import { Module, forwardRef } from '@nestjs/common'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Team } from './model/teams.model'
import { AuthModule } from '../auth/auth.module'
import { UploadModule } from '../upload/upload.module'

@Module({
    providers: [TeamsService],
    controllers: [TeamsController],
    imports: [
        UploadModule,
        SequelizeModule.forFeature([User, Team]),
        forwardRef(() => AuthModule),
    ],
    exports: [TeamsService],
})
export class TeamsModule {}
