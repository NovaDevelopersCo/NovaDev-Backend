import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
} from 'sequelize-typescript'
import { Role } from 'src/modules/roles/model/roles.model'
import { Auth, AuthDefault } from './auth.model'

interface UserCreationAttrs {
    email: string
    password: string
    roleId: number
    auth: Auth
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

    @Column({ type: DataType.STRING, allowNull: true })
    email: string

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: AuthDefault,
    })
    auth: Auth

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number

    @BelongsTo(() => Role)
    role: Role
}
