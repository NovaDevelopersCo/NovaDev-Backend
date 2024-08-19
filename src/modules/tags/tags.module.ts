import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'
import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Tags } from './model/tags.model'
import { User } from '../users/model/users.model'
import { UserTag } from './model/tagsUser.model'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UsersModule } from '../users/users.module'
@Module({
    providers: [TagsService],
    controllers: [TagsController],
    imports: [
        SequelizeModule.forFeature([Tags, UserTag, User]),
        forwardRef(() => AuthModule),
        UsersModule,
    ],
    exports: [TagsService],
})
export class TagsModule {}
