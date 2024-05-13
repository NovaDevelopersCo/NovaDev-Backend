import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
} from 'sequelize-typescript'
import { Role } from 'src/modules/roles/model/roles.model'

interface UserCreationAttrs {
    email: string
    password: string
    tariffId: number
    roleId: number
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string

    @Column({ type: DataType.STRING, allowNull: false })
    password: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    banReason: string

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number

    @BelongsTo(() => Role)
    role: Role
}
