import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'

interface RoleCreationAttrs {
    title: string
    level_access: number
    description: string
}
@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number

    @ApiProperty({ example: 3, description: 'Значение роли' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string

    @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @ApiProperty({ example: 3, description: 'Значение роли' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    level_access: number

    @HasMany(() => User)
    users: User[]
}
