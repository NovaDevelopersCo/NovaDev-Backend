import { TagsModule } from './modules/tags/tags.module'
import { UploadModule } from './modules/upload/upload.module'
import { ClientModule } from './modules/clients/clients.module'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { User } from './modules/users/model/users.model'
import { RolesModule } from './modules/roles/roles.module'
import { Role } from './modules/roles/model/roles.model'
import { AuthModule } from './modules/auth/auth.module'
import { Project } from './modules/project/model/project.model'
import { UserProject } from './modules/project/model/projectUser.model'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'

import { Team } from './modules/teams/model/teams.model'
import { TeamsModule } from './modules/teams/teams.module'
import { ProjectModule } from './modules/project/project.module'
import { Client } from './modules/clients/model/client.model'
import { BotModule } from './modules/bot/bot.module'
import { Tags } from './modules/tags/model/tags.model'
import { UserTag } from './modules/tags/model/tagsUser.model'

@Module({
    controllers: [],
    providers: [],
    imports: [
        TagsModule,
        UploadModule,
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },

            models: [User, Role, Project, UserProject, Client, Team, Tags, UserTag],

            autoLoadModels: true,
            synchronize: true,
        }),
        TagsModule,
        UsersModule,
        ClientModule,
        RolesModule,
        BotModule,
        ClientModule,
        ProjectModule,
        AuthModule,
        TeamsModule,
    ],
})
export class AppModule {}
