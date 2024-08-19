import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'

interface TagCreationAttrs {
    title: string
    description: string
    color: string
}
@Table({ tableName: 'tags' })
export class Tags extends Model<Tags, TagCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number

    @ApiProperty({ example: 'Frontend', description: 'Значение тега' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string

    @ApiProperty({
        example: 'Frontend - тег всех фронтендеров',
        description: 'Описание тега',
    })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @ApiProperty({ example: '#8B0000', description: 'Цвет' })
    @Column({ type: DataType.STRING, allowNull: false })
    color: string

    @HasMany(() => User)
    users: User[]
}

export const TagsDefault: TagCreationAttrs = {
    title: null,
    description: null,
    color: null,
}