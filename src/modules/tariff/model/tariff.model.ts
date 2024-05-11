import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'

interface tariffCreationAttrs {
    title: string
    level_access: number
    description: string
    price: number
}
@Table({ tableName: 'tariff' })
export class Tariff extends Model<Tariff, tariffCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number

    @ApiProperty({ example: 3, description: 'Значение тарифа' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string

    @ApiProperty({ example: 3, description: 'Цена тарифа' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    price: number

    @ApiProperty({ example: 'Базовый тариф', description: 'Описание тарифа' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @ApiProperty({ example: 3, description: 'Значение тарифа' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    level_access: number

    @HasMany(() => User)
    users: User[]
}
