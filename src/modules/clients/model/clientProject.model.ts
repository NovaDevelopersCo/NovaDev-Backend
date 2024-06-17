import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Client } from 'src/modules/clients/model/client.model';
import { Project } from 'src/modules/project/model/project.model';

@Table({ tableName: 'client_projects' })
export class ClientProjects extends Model<ClientProjects> {
    @ForeignKey(() => Client)
    @Column
    clientId: number;

    @ForeignKey(() => Project)
    @Column
    projectId: number;
}