import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript'
import { User } from 'src/modules/users/model/users.model'
import { Tags } from 'src/modules/tags/model/tags.model'

@Table({ tableName: 'user_tags' })
export class UserTag extends Model<UserTag> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number

    @ForeignKey(() => Tags)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    tagId: number

    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Tags)
    tag: Tags
}
