import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
} from 'sequelize-typescript'
import { Role } from 'src/modules/roles/model/roles.model'
import { Tariff } from 'src/modules/tariff/model/tariff.model'
import { Profile, ProfileDefault } from './profile.model'

interface UserCreationAttrs {
    email: string
    password: string
    tariffId: number
    roleId: number
    profile: Profile
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

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: ProfileDefault,
    })
    profile: Profile

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number

    @ForeignKey(() => Tariff)
    @Column({ type: DataType.INTEGER })
    tariffId: number

    @BelongsTo(() => Tariff)
    tariff: Tariff

    @BelongsTo(() => Role)
    role: Role
}
