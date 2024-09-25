import { Test, TestingModule } from '@nestjs/testing'
import { ProjectService } from '../project.service'
import { getModelToken } from '@nestjs/sequelize'
import { Project } from '../model/project.model'
import { UserProject } from '../model/projectUser.model'
import { User } from 'src/modules/users/model/users.model'

describe('ProjectService', () => {
    let service: ProjectService
    let projectRepositoryMock: any
    let userProjectRepositoryMock: any

    beforeEach(async () => {
        projectRepositoryMock = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
        }
        userProjectRepositoryMock = {
            findAll: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: getModelToken(Project),
                    useValue: projectRepositoryMock,
                },
                {
                    provide: getModelToken(UserProject),
                    useValue: userProjectRepositoryMock,
                },
            ],
        }).compile()

        service = module.get<ProjectService>(ProjectService)
    })

    describe('getAll', () => {
        it('should return an array of projects', async () => {
            const projects = [
                { id: 1, name: 'Project 1' },
                { id: 2, name: 'Project 2' },
            ]
            projectRepositoryMock.findAll.mockResolvedValue(projects)

            const result = await service.getAll()
            expect(result).toEqual(projects)
            expect(projectRepositoryMock.findAll).toHaveBeenCalledWith({
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
        })

        it('should throw if repository fails', async () => {
            projectRepositoryMock.findAll.mockRejectedValue(
                new Error('Failed to retrieve projects')
            )

            await expect(service.getAll()).rejects.toThrow(
                'Failed to retrieve projects'
            )
        })
    })

    describe('getProjectById', () => {
        it('should return a single project by ID', async () => {
            const project = { id: 1, name: 'Project 1' }
            projectRepositoryMock.findOne.mockResolvedValue(project)

            const result = await service.getProjectById(1)
            expect(result).toEqual(project)
            expect(projectRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['auth'] },
                    },
                ],
            })
        })

        it('should throw an error if project not found', async () => {
            projectRepositoryMock.findOne.mockResolvedValue(null)

            await expect(service.getProjectById(1)).rejects.toThrow(
                'Project not found'
            )
        })
    })
})
