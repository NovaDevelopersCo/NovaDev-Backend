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
import { FilesModule } from './modules/files/files.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'

import { Team } from './modules/teams/model/teams.model'
import { TeamsModule } from './modules/teams/teams.module'
import { ProjectModule } from './modules/project/project.module'
import { Client } from './modules/clients/model/client.model'

@Module({
    controllers: [],
    providers: [],
    imports: [
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

            models: [User, Role, Project, UserProject, Client, Team],
          
            autoLoadModels: true,
            synchronize: true,
        }),
        UsersModule,
        ClientModule,
        RolesModule,
        ClientModule,
        ProjectModule,
        AuthModule,
        FilesModule,
        TeamsModule,
    ],
})
export class AppModule {}
