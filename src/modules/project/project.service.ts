import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from '../users/model/users.model'
import { Project } from './model/project.model'
import { CreateProjectDto } from './dto/create-project.dto'
import { UserProject } from './model/projectUser.model'

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
            include: { all: true },
        })
        return projects
    }

    async getProjectByTitle(title: string) {
        const project = await this.projectRepository.findOne({
            where: { title },
        })
        return project
    }

    async getProjectById(id: number) {
        const project = await this.projectRepository.findOne({ where: { id } })
        return project
    }

    async deleteProject(id: number) {
        await this.projectRepository.destroy({ where: { id } })
        return { status: HttpStatus.OK, message: 'Project deleted' }
    }

    async AddUserToProject(projectId: number, userId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
        })
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        const user = await User.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const userProject = await user.$get('projects')
        const userHasProject = userProject.some(
            (userProject: any) => userProject.id === projectId
        )

        if (!userHasProject) {
            await user.$add('project', project)
            Logger.log(
                `Project with ID ${projectId} added to user with ID ${userId}`
            )
            return { message: 'successful' }
        } else {
            Logger.log(
                `User with ID ${userId} already has project with ID ${projectId}`
            )
            return { message: 'failed' }
        }
    }

    async CutUserToProject(projectId: number, userId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
        })
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        const user = await User.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const userProject = await user.$get('projects')
        const userHasProject = userProject.some(
            (userProject: any) => userProject.id === projectId
        )

        if (userHasProject) {
            await user.$remove('project', project)
            Logger.log(
                `Project with ID ${projectId} removed from user with ID ${userId}`
            )
            return { message: 'successful' }
        } else {
            Logger.log(
                `User with ID ${userId} does not have project with ID ${projectId}`
            )
            return { message: 'failed' }
        }
    }

    async updateProject(id: number, dto: CreateProjectDto) {
        const project = await this.getProjectById(id)
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

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
