import { Test, TestingModule } from '@nestjs/testing'
import { ClientService } from '../clients.service'
import { getModelToken } from '@nestjs/sequelize'
import { Client } from '../model/client.model'
import { Project } from 'src/modules/project/model/project.model'
import { CreateClientDto } from '../dto/create-client.dto'
import { HttpException } from '@nestjs/common'

describe('ClientService', () => {
    let service: ClientService
    let clientRepositoryMock: any
    let projectRepositoryMock: any

    beforeEach(async () => {
        clientRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            destroy: jest.fn(),
        }

        projectRepositoryMock = {
            findOne: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientService,
                {
                    provide: getModelToken(Client),
                    useValue: clientRepositoryMock,
                },
                {
                    provide: getModelToken(Project),
                    useValue: projectRepositoryMock,
                },
            ],
        }).compile()

        service = module.get<ClientService>(ClientService)
    })

    describe('createClient', () => {
        it('should create a client', async () => {
            const dto: CreateClientDto = {
                name: 'Max1',
                tg: '@igornezimin1',
                phone: '+797800012121',
            }
            const mockClient = { id: 3, ...dto }
            clientRepositoryMock.create.mockResolvedValue(mockClient)

            const result = await service.createClient(dto)
            expect(result).toEqual(mockClient)
            expect(clientRepositoryMock.create).toHaveBeenCalledWith(dto)
        })
    })

    describe('getAll', () => {
        it('should return an array of clients', async () => {
            const clients = [
                { id: 1, name: 'Client 1' },
                { id: 2, name: 'Client 2' },
            ]
            clientRepositoryMock.findAll.mockResolvedValue(clients)

            const result = await service.getAll()
            expect(result).toEqual(clients)
            expect(clientRepositoryMock.findAll).toHaveBeenCalledWith({
                include: { all: true },
            })
        })
    })

    describe('getClientById', () => {
        it('should return a single client by ID', async () => {
            const client = { id: 3, name: 'Max1' }
            clientRepositoryMock.findOne.mockResolvedValue(client)

            const result = await service.getClientById(3)
            expect(result).toEqual(client)
            expect(clientRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { id: 3 },
                include: { all: true },
            })
        })

        it('should throw an error if client not found', async () => {
            clientRepositoryMock.findOne.mockResolvedValue(null)

            await expect(service.getClientById(3)).rejects.toThrow(
                HttpException
            )
        })
    })

    describe('deleteClient', () => {
        it('should delete a client', async () => {
            const mockClient = {
                id: 3,
                destroy: jest.fn(),
            }
            clientRepositoryMock.findOne.mockResolvedValue(mockClient)
            mockClient.destroy.mockResolvedValue(null)

            const result = await service.deleteClient(3)
            expect(result).toEqual({
                status: 200,
                message: 'Client deleted successfully',
            })
            expect(clientRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { id: 3 },
                include: { all: true },
            })
            expect(mockClient.destroy).toHaveBeenCalled()
        })

        it('should throw an error if client not found', async () => {
            clientRepositoryMock.findOne.mockResolvedValue(null)

            await expect(service.deleteClient(3)).rejects.toThrow(HttpException)
        })
    })
})
