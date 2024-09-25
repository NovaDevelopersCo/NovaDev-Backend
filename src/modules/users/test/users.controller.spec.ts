import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { RolesService } from '../../roles/roles.service'
import { TeamsService } from '../../teams/teams.service'
import { UploadService } from '../../upload/upload.service'
import { getModelToken } from '@nestjs/sequelize'
import { User } from '../model/users.model'
import { JwtService } from '@nestjs/jwt'
import { userMock } from './mock/user.mock'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'
import { HttpException, HttpStatus } from '@nestjs/common'

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
const mockJwtService = {}
const mockUploadService = {}
describe('UsersController', () => {
    let controller: UsersController
    let userRepository
    beforeEach(async () => {
        userRepository = {
            findAll: jest.fn().mockResolvedValue([userMock]),
            create: jest.fn().mockResolvedValue(mockFnUser),
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                { provide: RolesService, useValue: mockRolesService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: TeamsService, useValue: mockTeamsService },
                { provide: UploadService, useValue: mockUploadService },
                {
                    provide: getModelToken(User),
                    useValue: userRepository,
                },
            ],
        }).compile()

        controller = module.get<UsersController>(UsersController)
    })
    it('should return an array of users', async () => {
        expect(await controller.getAll()).toEqual([userMock])
    })

    it('should create a new user', async () => {
        const result = await controller.createUser()
        expect(result.login).toMatch(/^[a-zA-Z0-9._%+-]+@nova\.com$/)
        expect(result.password).toHaveLength(8)
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
        const result = await controller.getUserById(2)
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
        await expect(controller.getUserById(222)).rejects.toThrowError(
            notFoundException
        )
    })
})
