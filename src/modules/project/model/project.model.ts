import { ApiProperty } from '@nestjs/swagger'
import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'
import { Client } from 'src/modules/clients/model/client.model' // Предположим, что у вас есть модель Client

interface ProjectCreationAttrs {
    title: string
    technologies: string[]
    server: string
    documentation: string
    deadline: Date
    client: Client /*Поменять на Client когда он будет*/
    users: User[]
}

@Table({ tableName: 'project' })
export class Project extends Model<Project, ProjectCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный идентефикатор' })
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
        description: 'Сервер для проекта Пирамида в Санкт-Питербурге',
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

    @ApiProperty({
        example: 'Марс',
        description: 'Заказчик проекта',
    })
    @ForeignKey(() => Client)
    @Column({ type: DataType.INTEGER })
    clientId: number

    @BelongsTo(() => Client)
    client: Client

    @HasMany(() => User)
    users: User[]
}
