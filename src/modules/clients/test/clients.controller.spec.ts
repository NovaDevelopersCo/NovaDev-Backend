/* eslint-disable  @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing'
import { ClientController } from '../clients.controller'
import { ClientService } from '../clients.service'
import { CreateClientDto } from '../dto/create-client.dto'
import { InteractionClientDto } from '../dto/interaction-client.dto'
import { Client } from '../model/client.model'
import { RolesGuard } from 'src/guards/roles.guard'

describe('ClientController', () => {
    let controller: ClientController
    let service: ClientService

    const mockClient = {
        id: 1,
        name: 'Max1',
        tg: '@igornezimin1',
        phone: '+797800012121',
    } as Client

    const mockClientService = {
        createClinet: jest.fn(() => Promise.resolve(mockClient)),
        getClientById: jest.fn((id: number) => Promise.resolve(mockClient)),
        updateClient: jest.fn((id: number, dto: CreateClientDto) =>
            Promise.resolve(mockClient)
        ),
        addClientToProject: jest.fn((projectId: number, clientId: number) =>
            Promise.resolve({ status: 200, message: 'Client added to project' })
        ),
        CutClientToProject: jest.fn((projectId: number, clientId: number) =>
            Promise.resolve({
                status: 200,
                message: 'Client removed from project',
            })
        ),
        deleteClient: jest.fn((id: number) =>
            Promise.resolve({
                status: 200,
                message: 'Client deleted successfully',
            })
        ),
        getAll: jest.fn(() => Promise.resolve([mockClient])),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientController],
            providers: [
                {
                    provide: ClientService,
                    useValue: mockClientService,
                },
            ],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile()

        controller = module.get<ClientController>(ClientController)
        service = module.get<ClientService>(ClientService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    // describe('create', () => {
    //     it('should create a client', async () => {
    //         const dto: CreateClientDto = {
    //             name: 'Max1',
    //             tg: '@igornezimin1',
    //             phone: '+797800012121',
    //         }
    //         const result = await controller.create(dto)
    //         expect(result).toEqual(mockClient)
    //         expect(service.createClient).toHaveBeenCalledWith(dto)
    //     })
    // })

    describe('getById', () => {
        it('should return a client by ID', async () => {
            const result = await controller.getById(1)
            expect(result).toEqual(mockClient)
            expect(service.getClientById).toHaveBeenCalledWith(1)
        })

        it('should throw an error if client not found', async () => {
            jest.spyOn(service, 'getClientById').mockRejectedValueOnce(
                new Error('Client not found')
            )
            try {
                await controller.getById(99)
            } catch (e) {
                expect(e.message).toBe('Client not found')
            }
        })
    })

    describe('updateProject', () => {
        it('should update a client', async () => {
            const dto: CreateClientDto = {
                name: 'Updated Max',
                tg: '@updated',
                phone: '+798800012123',
            }
            const result = await controller.updateProject(1, dto)
            expect(result).toEqual(mockClient)
            expect(service.updateClient).toHaveBeenCalledWith(1, dto)
        })
    })

    describe('addUser', () => {
        it('should add a client to a project', async () => {
            const dto: InteractionClientDto = { projectId: 1, clientId: 1 }
            const result = await controller.addUser(dto)
            expect(result).toEqual({
                status: 200,
                message: 'Client added to project',
            })
            expect(service.addClientToProject).toHaveBeenCalledWith(
                dto.projectId,
                dto.clientId
            )
        })
    })

    describe('cutUser', () => {
        it('should cut a client from a project', async () => {
            const dto: InteractionClientDto = { projectId: 1, clientId: 1 }
            const result = await controller.cutUser(dto)
            expect(result).toEqual({
                status: 200,
                message: 'Client removed from project',
            })
            expect(service.CutClientToProject).toHaveBeenCalledWith(
                dto.projectId,
                dto.clientId
            )
        })
    })

    describe('deleteProject', () => {
        it('should delete a client', async () => {
            const result = await controller.deleteProject(1)
            expect(result).toEqual({
                status: 200,
                message: 'Client deleted successfully',
            })
            expect(service.deleteClient).toHaveBeenCalledWith(1)
        })
    })

    describe('getAll', () => {
        it('should return an array of clients', async () => {
            const result = await controller.getAll()
            expect(result).toEqual([mockClient])
            expect(service.getAll).toHaveBeenCalled()
        })
    })
})
