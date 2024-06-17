import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './model/client.model'
import { CreateClientDto } from './dto/create-client.dto'
import { Project } from '../project/model/project.model'

@Injectable()
export class ClinetService {
    constructor(
        @InjectModel(Project)
        private projectRepository: typeof Project,
        @InjectModel(Client)
        private clientRepository: typeof Client
    ) {}

    async createClinet(dto: CreateClientDto) {
        const client = await this.clientRepository.create(dto)
        return client
    }

    async getAll() {
        const client = await this.clientRepository.findAll({
            include: { all: true },
        })
        return client
    }

    async getClientByName(name: string) {
        const client = await this.clientRepository.findOne({
            where: { name },
        })
        return client
    }

    async getClientById(id: number) {
        const client = await this.clientRepository.findOne({ where: { id } })
        return client
    }

    async deleteClient(id: number) {
        await this.clientRepository.destroy({ where: { id } })
        return { status: HttpStatus.OK, message: 'Client deleted' }
    }

    async addClientToProject(
        projectId: number,
        clientId: number
    ): Promise<{ message: string }> {
        const project = await this.projectRepository.findByPk(projectId)
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        if (project.clientId !== null) {
            throw new HttpException(
                'Project already has a client',
                HttpStatus.BAD_REQUEST
            )
        }

        const client = await Client.findByPk(clientId)
        if (!client) {
            throw new HttpException('Client not found', HttpStatus.NOT_FOUND)
        }

        await client.$add('projects', project)

        project.clientId = client.id
        await project.save()

        Logger.log(
            `Project with ID ${projectId} added to client with ID ${clientId}`
        )
        return { message: 'successful' }
    }

    async CutClientToProject(projectId: number, clientId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
        })
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        const client = await Client.findByPk(clientId)
        if (!client) {
            throw new HttpException('Client not found', HttpStatus.NOT_FOUND)
        }

        const clientProject = await client.$get('projects')
        const clientHasProject = clientProject.some(
            (clientProject: any) => clientProject.id === projectId
        )

        if (clientHasProject) {
            await client.$remove('project', project)
            Logger.log(
                `Project with ID ${projectId} removed from client with ID ${clientId}`
            )
            return { message: 'successful' }
        } else {
            Logger.log(
                `Client with ID ${clientId} does not have project with ID ${projectId}`
            )
            return { message: 'failed' }
        }
    }

    async updateClient(id: number, dto: CreateClientDto) {
        const client = await this.getClientById(id)
        if (!client) {
            throw new HttpException('Client not found', HttpStatus.NOT_FOUND)
        }

        Object.assign(client, dto)

        try {
            await client.save()
        } catch (error) {
            throw new HttpException(
                'Failed to update client',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        return client
    }
}
