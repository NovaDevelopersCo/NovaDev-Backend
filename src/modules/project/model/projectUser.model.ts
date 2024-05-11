import { Model, Table, ForeignKey } from 'sequelize-typescript';
import { Project } from './project.model';
import { User } from 'src/modules/users/model/users.model';


@Table({ tableName: 'user_project' })
export class UserProject extends Model<UserProject> {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => Project)
  projectId: number;
}