import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './model/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../roles/model/roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { Post } from '../posts/model/posts.model';
import { Tags } from '../tags/model/tags.model';
import { UserTag } from '../tags/model/tagsUser.model';
import { TariffModule } from '../tariff/tariff.module';
import { TagsModule } from '../tags/tags.module';
import { Project } from '../project/model/project.model';
import { UserProject } from '../project/model/projectUser.model';
import { ProjectModule } from '../project/project.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([
            User,
            Role,
            Post,
            Tags,
            UserTag,
            Project,
            UserProject,
        ]),
        forwardRef(() => ProjectModule),
        forwardRef(() => TagsModule),
        RolesModule,
        TariffModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
