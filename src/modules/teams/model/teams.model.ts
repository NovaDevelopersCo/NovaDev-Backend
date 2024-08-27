import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'

interface TeamCreationAttrs {
    title: string
    description: string
    image: string
    userId: number
}
@Table({ tableName: 'teams' })
export class Team extends Model<Team, TeamCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный идентефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    @ApiProperty({ example: 'Команда Крутых', description: 'Крутое название' })
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    title: string

    @ApiProperty({
        example: 'Крутое описание команды',
        description: 'Крутое описание',
    })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @ApiProperty({
        example: 'Крутая картинка',
        description: 'Картинка прям вау',
    })
    @Column({ type: DataType.STRING, allowNull: false })
    image: string

    @HasMany(() => User)
    users: User[]
}
