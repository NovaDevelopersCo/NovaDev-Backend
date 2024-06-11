import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/model/users.model';
import { Project } from './model/project.model';
import { UserProject } from './model/projectUser.model';
import { ProjectService } from './project.service';
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProjectController } from './project.controller';

@Module({
    controllers: [ProjectController],
    providers: [ProjectService],
    imports: [
        SequelizeModule.forFeature([Project, UserProject, User]),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
    ],
    exports: [ProjectService],
})
export class ProjectModule {}
