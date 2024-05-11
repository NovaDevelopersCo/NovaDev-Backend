import { TagsModule } from './modules/tags/tags.module'
import { TagsController } from './modules/tags/tags.controller'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { User } from './modules/users/model/users.model'
import { RolesModule } from './modules/roles/roles.module'
import { Role } from './modules/roles/model/roles.model'
import { AuthModule } from './modules/auth/auth.module'
import { PostsModule } from './modules/posts/posts.module'
import { Post } from './modules/posts/model/posts.model'
import { FilesModule } from './modules/files/files.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import { TariffModule } from './modules/tariff/tariff.module'
import { Tariff } from './modules/tariff/model/tariff.model'
import { Tags } from './modules/tags/model/tags.model'
import { UserTag } from './modules/tags/model/tagsUser.model'

@Module({
    controllers: [TagsController],
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
            models: [User, Role, Post, Tariff, Tags, UserTag],
            autoLoadModels: true,
            synchronize: true,
        }),
        UsersModule,
        TariffModule,
        RolesModule,
        TagsModule,
        AuthModule,
        PostsModule,
        FilesModule,
    ],
})
export class AppModule {}
