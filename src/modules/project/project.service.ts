import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Project } from './model/project.model'
import { CreateProjectDto } from './dto/create-project.dto'
import { UserProject } from './model/projectUser.model'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project) private projectRepository: typeof Project,
        @InjectModel(UserProject)
        private userProjectRepository: typeof UserProject
    ) {}

    async createProject(dto: CreateProjectDto) {
        const project = await this.projectRepository.create(dto)
        return project
    }

    async getAll() {
        const projects = await this.projectRepository.findAll({
            include: [
                {
                    model: UserProject,
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['auth'] },
                        },
                    ],
                },
            ],
        })
        return projects
    }

    async getProjectById(id: number) {
        const project = await findOrThrowWithValidation<Project>(
            this.projectRepository,
            id,
            {
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['auth'] },
                    },
                ],
            },
            'Project'
        )
        return project
    }

    async deleteProject(
        id: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const project = await findOrThrowWithValidation<Project>(
            this.projectRepository,
            id,
            { include: { all: true } },
            'Project'
        )
        try {
            await project.destroy()
            Logger.log(`Project ${id} was deleted successfully`)
            return {
                status: HttpStatus.OK,
                message: 'Project deleted successfully',
            }
        } catch (error) {
            Logger.log(`Error deleting Project with id ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting Project',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async AddUserToProject(projectId: number, userId: number) {
        const project = await findOrThrowWithValidation<Project>(
            this.projectRepository,
            projectId,
            { include: { all: true } },
            'Project'
        )

        const user = await findOrThrowWithValidation<User>(
            User,
            userId,
            { include: { all: true } },
            'User'
        )
        const userProject = await user.$get('projects')
        const userHasProject = userProject.some(
            (userProject: any) => userProject.id === projectId
        )

        if (!userHasProject) {
            await user.$add('project', project)
            Logger.log(
                `Project with ID ${projectId} added to user with ID ${userId}`
            )
            return { status: HttpStatus.OK, message: 'successful' }
        } else {
            Logger.log(
                `User with ID ${userId} already has project with ID ${projectId}`
            )
            return { status: HttpStatus.CONFLICT, message: 'failed' }
        }
    }

    async CutUserToProject(projectId: number, userId: number) {
        const project = await findOrThrowWithValidation<Project>(
            this.projectRepository,
            projectId,
            { include: { all: true } },
            'Project'
        )

        const user = await findOrThrowWithValidation<User>(
            User,
            userId,
            { include: { all: true } },
            'User'
        )

        const userProject = await user.$get('projects')
        const userHasProject = userProject.some(
            (userProject: any) => userProject.id === projectId
        )

        if (userHasProject) {
            await user.$remove('project', project)
            Logger.log(
                `Project with ID ${projectId} removed from user with ID ${userId}`
            )
            return { status: HttpStatus.OK, message: 'successful' }
        } else {
            Logger.log(
                `User with ID ${userId} does not have project with ID ${projectId}`
            )
            return { status: HttpStatus.CONFLICT, message: 'failed' }
        }
    }

    async updateProject(id: number, dto: CreateProjectDto) {
        const project = await findOrThrowWithValidation<Project>(
            this.projectRepository,
            id,
            {
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['auth'] },
                    },
                ],
            },
            'Project'
        )

        Object.assign(project, dto)

        try {
            await project.save()
        } catch (error) {
            throw new HttpException(
                'Failed to update project',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        return project
    }
}
