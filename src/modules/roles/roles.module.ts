import { forwardRef, Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Role } from './model/roles.model'
import { User } from '../users/model/users.model'
import { AuthModule } from '../auth/auth.module'

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User]),
        forwardRef(() => AuthModule),
    ],
    exports: [RolesService],
})
export class RolesModule {}
