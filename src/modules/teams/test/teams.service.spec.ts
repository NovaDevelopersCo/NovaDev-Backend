import { Test, TestingModule } from '@nestjs/testing'
import { TeamsService } from '../teams.service'
import { getModelToken } from '@nestjs/sequelize'
import { Team } from '../model/teams.model'
import { User } from 'src/modules/users/model/users.model'
import { UploadService } from 'src/modules/upload/upload.service'
import { ConflictException, HttpException } from '@nestjs/common'

describe('TeamsService', () => {
    let service: TeamsService
    let teamRepositoryMock: any
    let userRepositoryMock: any
    let uploadServiceMock: any

    beforeEach(async () => {
        teamRepositoryMock = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn(),
        }
        userRepositoryMock = {
            findOne: jest.fn(),
            save: jest.fn(),
        }
        uploadServiceMock = {
            uploadFile: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamsService,
                {
                    provide: getModelToken(Team),
                    useValue: teamRepositoryMock,
                },
                {
                    provide: getModelToken(User),
                    useValue: userRepositoryMock,
                },
                {
                    provide: UploadService,
                    useValue: uploadServiceMock,
                },
            ],
        }).compile()

        service = module.get<TeamsService>(TeamsService)
    })

    describe('getAllTeams', () => {
        it('should return an array of teams', async () => {
            const teams = [
                {
                    id: 143,
                    title: 'Стлплтарнклитролстар',
                    description:
                        'Стальные лисы — это профессиональная команда по хоккею',
                    image: '',
                    createdAt: '2024-09-10T07:50:22.427Z',
                    updatedAt: '2024-09-10T07:50:22.427Z',
                    users: [],
                },
            ]
            teamRepositoryMock.findAll.mockResolvedValue(teams)

            const result = await service.getAllTeams()
            expect(result).toEqual(teams)
            expect(teamRepositoryMock.findAll).toHaveBeenCalledWith({
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['auth'] },
                    },
                ],
            })
        })
    })

    describe('getTeamById', () => {
        it('should return a team by ID', async () => {
            const team = {
                id: 143,
                title: 'Стлплтарнклитролстар',
                description:
                    'Стальные лисы — это профессиональная команда по хоккею',
                image: '',
                createdAt: '2024-09-10T07:50:22.427Z',
                updatedAt: '2024-09-10T07:50:22.427Z',
                users: [],
            }
            teamRepositoryMock.findOne.mockResolvedValue(team)

            const result = await service.getTeamById(143)
            expect(result).toEqual(team)
            expect(teamRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { id: 143 },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['auth'] },
                    },
                ],
            })
        })

        it('should throw an error if team not found', async () => {
            teamRepositoryMock.findOne.mockResolvedValue(null)

            await expect(service.getTeamById(143)).rejects.toThrow(
                'Team not found'
            )
        })
    })

    describe('createTeam', () => {
        it('should create a new team and return it', async () => {
            const dto = {
                title: 'Новая команда',
                description: 'Описание новой команды',
            }
            const image = null
            const createdTeam = {
                id: 144,
                title: 'Новая команда',
                description: 'Описание новой команды',
                image: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [],
            }
            teamRepositoryMock.create.mockResolvedValue(createdTeam)

            const result = await service.createTeam(dto, image)
            expect(result).toEqual(createdTeam)
            expect(teamRepositoryMock.create).toHaveBeenCalledWith({
                ...dto,
                image: '',
            })
        })

        it('should throw ConflictException if team already exists', async () => {
            const dto = {
                title: 'Существующая команда',
                description: 'Описание существующей команды',
            }
            const image = null
            teamRepositoryMock.create.mockRejectedValue({
                name: 'SequelizeUniqueConstraintError',
            })

            await expect(service.createTeam(dto, image)).rejects.toThrow(
                ConflictException
            )
        })
    })

    describe('addUserToTeam', () => {
        it('should add user to team', async () => {
            const userId = 1
            const teamId = 143
            const user = { id: userId, teamId: null, save: jest.fn() }
            const team = { id: teamId }

            userRepositoryMock.findOne.mockResolvedValue(user)
            teamRepositoryMock.findOne.mockResolvedValue(team)

            const result = await service.addUserToTeam(teamId, userId)
            expect(result).toEqual({ status: 201, message: 'successful' })
            expect(user.teamId).toBe(teamId)
            expect(user.save).toHaveBeenCalled()
        })

        it('should throw HttpException if user is already in the team', async () => {
            const userId = 1
            const teamId = 143
            const user = { id: userId, teamId: teamId }

            userRepositoryMock.findOne.mockResolvedValue(user)

            await expect(service.addUserToTeam(teamId, userId)).rejects.toThrow(
                HttpException
            )
        })
    })

    describe('deleteTeam', () => {
        it('should delete the team successfully', async () => {
            const team = {
                id: 143,
                destroy: jest.fn(),
            }
            teamRepositoryMock.findOne.mockResolvedValue(team)

            const result = await service.deleteTeam(143)
            expect(result).toEqual({
                status: 200,
                message: 'Team deleted successfully',
            })
            expect(team.destroy).toHaveBeenCalled()
        })

        it('should throw HttpException if team not found', async () => {
            teamRepositoryMock.findOne.mockResolvedValue(null)

            await expect(service.deleteTeam(143)).rejects.toThrow(HttpException)
        })
    })
})
