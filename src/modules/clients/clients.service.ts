import {
    HttpStatus,
    Injectable,
    HttpException,
    Logger,
    BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './model/client.model'
import { CreateClientDto } from './dto/create-client.dto'
import { Project } from '../project/model/project.model'
import { findOrThrow } from 'src/helpers/findOrThrow'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'

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
        const client = await findOrThrow(
            this.clientRepository,
            name,
            'name',
            { include: { all: true } },
            'Client'
        )
        return client
    }

    async getClientById(id: number) {
        const client = await findOrThrowWithValidation(
            this.clientRepository,
            id,
            { include: { all: true } },
            'Client'
        )
        return client
    }

    async deleteClient(
        id: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const client = await findOrThrowWithValidation<Client>(
            this.clientRepository,
            id,
            { include: { all: true } },
            'Client'
        )
        try {
            await client.destroy()
            Logger.log(`Client ${id} was deleted successfully`)
            return {
                status: HttpStatus.OK,
                message: 'Client deleted successfully',
            }
        } catch (error) {
            Logger.log(`Error deleting Client with id ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting Client',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async addClientToProject(
        projectId: number,
        clientId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const project = await findOrThrowWithValidation(
            this.projectRepository,
            projectId,
            { include: { all: true } },
            'Project'
        )

        if (project.clientId !== null) {
            throw new HttpException(
                'Project already has a client',
                HttpStatus.BAD_REQUEST
            )
        }

        const client = await findOrThrowWithValidation(
            this.clientRepository,
            clientId,
            { include: { all: true } },
            'Client'
        )

        await client.$add('projects', project)

        project.clientId = client.id
        await project.save()

        Logger.log(
            `Project with ID ${projectId} added to client with ID ${clientId}`
        )

        return { status: HttpStatus.OK, message: 'successful' }
    }

    async CutClientToProject(
        projectId: number,
        clientId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const project = await findOrThrowWithValidation(
            this.projectRepository,
            projectId,
            { include: { all: true } },
            'Project'
        )
        const client = await findOrThrowWithValidation(
            this.clientRepository,
            clientId,
            { include: { all: true } },
            'Client'
        )

        const clientProject = await client.$get('projects')
        const clientHasProject = clientProject.some(
            (clientProject: any) => clientProject.id === projectId
        )

        if (clientHasProject) {
            await client.$remove('project', project)
            Logger.log(
                `Project with ID ${projectId} removed from client with ID ${clientId}`
            )
            return { status: HttpStatus.OK, message: 'successful' }
        } else {
            Logger.log(
                `Client with ID ${clientId} does not have project with ID ${projectId}`
            )
            return { status: HttpStatus.CONFLICT, message: 'failed' }
        }
    }

    async updateClient(id: number, dto: CreateClientDto) {
        const client = await findOrThrowWithValidation(
            this.clientRepository,
            id,
            { include: { all: true } },
            'Client'
        )

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
