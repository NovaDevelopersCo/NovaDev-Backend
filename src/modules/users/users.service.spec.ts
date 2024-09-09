import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/sequelize'
import { User } from './model/users.model'
import { Model } from 'sequelize'

describe('UserService', () => {
    let usersService: UsersService
    let model: typeof User

    const mockUserModel = {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserService,
                },
            ],
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        model = module.get<Model<User>>(getModelToken(User.name))
    })
})
