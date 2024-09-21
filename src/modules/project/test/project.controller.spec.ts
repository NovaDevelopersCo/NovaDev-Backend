import { Test, TestingModule } from '@nestjs/testing'
import { ProjectController } from '../project.controller'
import { ProjectService } from '../project.service'
import { CreateProjectDto } from '../dto/create-project.dto'
import { InteractionProjectDto } from '../dto/interaction-project.dto'
import { Project } from '../model/project.model'
import { RolesGuard } from 'src/guards/roles.guard'
import { JwtAuthGuard } from 'src/guards/JwtAuth.guard'

describe('ProjectController', () => {
    let controller: ProjectController
    let service: ProjectService


    const mockProject = {
        id: 25,
        title: 'Ecomerse121',
        technologies: ['NestJS', 'FastApi'],
        server: '', 
        documentation: '', 
        deadline: new Date('2006-01-01T20:01:00.000Z'),
        clientId: null,
        createdAt: new Date('2024-09-09T07:18:36.310Z'), 
        updatedAt: new Date('2024-09-09T07:18:36.310Z'),
        users: [],
    } as Project

    const mockProjectService = {
        getAll: jest.fn(() => Promise.resolve([mockProject])),
        getProjectById: jest.fn((id: number) => Promise.resolve(mockProject)),
        createProject: jest.fn((dto: CreateProjectDto) =>
            Promise.resolve(mockProject)
        ),
        AddUserToProject: jest.fn((projectId: number, userId: number) =>
            Promise.resolve({ status: 200, message: 'successful' })
        ),
        CutUserToProject: jest.fn((projectId: number, userId: number) =>
            Promise.resolve({ status: 200, message: 'successful' })
        ),
        deleteProject: jest.fn((id: number) =>
            Promise.resolve({
                status: 200,
                message: 'Project deleted successfully',
            })
        ),
        updateProject: jest.fn((id: number, dto: CreateProjectDto) =>
            Promise.resolve(mockProject)
        ),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectController],
            providers: [
                {
                    provide: ProjectService,
                    useValue: mockProjectService,
                },
            ],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile()

        controller = module.get<ProjectController>(ProjectController)
        service = module.get<ProjectService>(ProjectService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getAll', () => {
        it('should return an array of projects', async () => {
            const result = await controller.getAll()
            expect(result).toEqual([mockProject])
            expect(service.getAll).toHaveBeenCalled()
        })
    })

    describe('getById', () => {
        it('should return a project by ID', async () => {
            const result = await controller.getById(1)
            expect(result).toEqual(mockProject)
            expect(service.getProjectById).toHaveBeenCalledWith(1)
        })

        it('should throw a 404 error if project is not found', async () => {
            jest.spyOn(service, 'getProjectById').mockRejectedValueOnce(
                new Error('Project not found')
            )
            try {
                await controller.getById(99)
            } catch (e) {
                expect(e.message).toBe('Project not found')
            }
        })
    })
})
