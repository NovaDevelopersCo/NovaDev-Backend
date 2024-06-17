import { ApiProperty } from '@nestjs/swagger'
import {
    Column,
    DataType,
    Model,
    Table,
    BelongsTo,
    ForeignKey,
    HasMany,
} from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'
import { Client } from 'src/modules/clients/model/client.model'
import { UserProject } from './projectUser.model' // Модель связки

interface ProjectCreationAttrs {
    title: string
    technologies: string[]
    server: string
    documentation: string
    deadline: Date
    client: Client // можно оставить как есть или сделать клиент ID
    users: User[]
}

@Table({ tableName: 'project' })
export class Project extends Model<Project, ProjectCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    @ApiProperty({
        example: 'Пирамида',
        description: 'Название Проекта',
    })
    @Column({ type: DataType.STRING, allowNull: true })
    title: string

    @ApiProperty({
        example: 'NestJS',
        description: 'Массив технологий которые используются в проекте',
    })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    technologies: string[]

    @ApiProperty({
        example: 'Пирамида СПБ',
        description: 'Сервер для проекта Пирамида в Санкт-Петербурге',
    })
    @Column({ type: DataType.STRING, allowNull: true })
    server: string

    @ApiProperty({
        example: 'Https://Piramida?docs',
        description: 'Ссылка на документацию',
    })
    @Column({ type: DataType.STRING, allowNull: true })
    documentation: string

    @ApiProperty({
        example: '10.03.2006',
        description: 'Дедлайн проекта',
    })
    @Column({ type: DataType.DATE, allowNull: true })
    deadline: Date

    @ForeignKey(() => Client)
    @Column({ type: DataType.INTEGER })
    clientId: number

    @BelongsTo(() => Client)
    client: Client

    @HasMany(() => UserProject)
    users: UserProject[]
}
