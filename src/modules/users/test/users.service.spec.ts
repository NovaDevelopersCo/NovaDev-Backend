import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users.service'
import { getModelToken } from '@nestjs/sequelize'
import { User } from '../model/users.model'
import { RolesService } from '../../roles/roles.service'
import { UploadService } from '../../upload/upload.service'
import { TeamsService } from '../../teams/teams.service'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'
import { HttpException, HttpStatus } from '@nestjs/common'
import { userMock } from './mock/user.mock'

jest.mock('src/helpers/findOrThrowWithValidation')

const mockRolesService = {
    getRoleByTitle: jest.fn().mockResolvedValue({
        id: 1,
        title: 'FRONTEND',
        description: 'Frontend Developer',
        level_access: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
}

const mockFnUser = {
    save: jest.fn().mockResolvedValue(true),
}

const mockTeamsService = {}
const mockUploadService = {}

describe('UsersService', () => {
    let service: UsersService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: RolesService, useValue: mockRolesService },
                { provide: TeamsService, useValue: mockTeamsService },
                { provide: UploadService, useValue: mockUploadService },
                {
                    provide: getModelToken(User),
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([userMock]),
                        findOrThrowName: jest
                            .fn()
                            .mockResolvedValue(mockFnUser),
                        findOrThrowWithValidation: jest
                            .fn()
                            .mockResolvedValue(mockFnUser),
                    },
                },
            ],
        }).compile()

        service = module.get<UsersService>(UsersService)
    })

    it('should return an array of users', async () => {
        expect(await service.getAllUsers()).toEqual([userMock])
    })

    it('should return a user if found by the correct ID', async () => {
        ;(findOrThrowWithValidation as jest.Mock).mockImplementation(
            (repository, id) => {
                if (id === 2) {
                    return Promise.resolve(userMock)
                }
                return Promise.resolve(null)
            }
        )
        const result = await service.getUserById(2)
        expect(result).toEqual(userMock)
    })

    it('should throw an exception if user not found', async () => {
        const notFoundException = new HttpException(
            'User not found',
            HttpStatus.NOT_FOUND
        )
        ;(findOrThrowWithValidation as jest.Mock).mockRejectedValue(
            notFoundException
        )
        await expect(service.getUserById(222)).rejects.toThrowError(
            notFoundException
        )
    })
})
