import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
    BelongsToMany,
} from 'sequelize-typescript'
import { Role } from 'src/modules/roles/model/roles.model'
import { Team } from 'src/modules/teams/model/teams.model'
import { Auth, AuthDefault } from './auth.model'
import { Project } from 'src/modules/project/model/project.model'
import { UserProject } from 'src/modules/project/model/projectUser.model'
import { Info, InfoDefault } from './info.model'

interface UserCreationAttrs {
    email: string
    password: string
    roleId: number
    projects: Project[]
    auth: Auth
    info: Info
    tg_id?: string | null
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

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: AuthDefault,
    })
    auth: Auth

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: InfoDefault,
    })
    info: Info

    @Column({ type: DataType.STRING, unique: true, allowNull: true })
    tg_id: string

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number

    @BelongsTo(() => Role)
    role: Role

    @ForeignKey(() => Team)
    @Column({ type: DataType.INTEGER })
    teamId: number

    @BelongsTo(() => Team)
    team: Team

    @BelongsToMany(() => Project, () => UserProject)
    projects: Project[]

    @ForeignKey(() => Project)
    ProjectId: number
}
