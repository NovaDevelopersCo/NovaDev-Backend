import {
    Model,
    Table,
    ForeignKey,
    BelongsTo,
    DataType,
    Column,
} from 'sequelize-typescript'
import { Project } from './project.model'
import { User } from 'src/modules/users/model/users.model'

@Table({ tableName: 'user_project' })
export class UserProject extends Model<UserProject> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    projectId: number

    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Project)
    project: Project
}
