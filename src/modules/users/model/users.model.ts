import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
} from 'sequelize-typescript'
import { Role } from 'src/modules/roles/model/roles.model'
import { Team } from 'src/modules/teams/model/teams.model'

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

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number

    @BelongsTo(() => Role)
    role: Role

    @ForeignKey(() => Team)
    @Column({ type: DataType.INTEGER })
    teamId: number
}
