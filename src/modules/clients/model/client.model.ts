import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { Project } from 'src/modules/project/model/project.model'

interface ClientCreationAttrs {
    name: string
    tg: string
    phone: string | null
}
@Table({ tableName: 'client' })
export class Client extends Model<Client, ClientCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентефикатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number

    @ApiProperty({ example: 'Mars', description: 'Имя' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string

    @ApiProperty({ example: '@igornezimin', description: 'Айди телеграма' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    tg: string

    @ApiProperty({ example: '+79261234567', description: 'Телефон' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    phone: string | null

    @HasMany(() => Project)
    projects: Project[]
}
