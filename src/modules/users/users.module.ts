import { Module, forwardRef } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from './model/users.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Role } from 'src/modules/roles/model/roles.model'
import { RolesModule } from 'src/modules/roles/roles.module'
import { AuthModule } from 'src/modules/auth/auth.module'
import { Post } from 'src/modules/posts/model/posts.model'
import { Tags } from 'src/modules/tags/model/tags.model'
import { UserTag } from 'src/modules/tags/model/tagsUser.model'
import { TariffModule } from '../tariff/tariff.module'
import { TagsModule } from '../tags/tags.module'

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, Post, Tags, UserTag]),
        forwardRef(() => TagsModule),
        RolesModule,
        TariffModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
