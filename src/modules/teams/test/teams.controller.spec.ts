import { Test, TestingModule } from '@nestjs/testing'
import { TeamsController } from '../teams.controller'
import { TeamsService } from '../teams.service'
import { TeamDto } from '../dto/create-team.dto'
import { InteractionTeamDto } from '../dto/interaction-team.dto'
import { Team } from '../model/teams.model'
import { RolesGuard } from 'src/guards/roles.guard'

describe('TeamsController', () => {
    let controller: TeamsController
    let service: TeamsService

    const mockTeam = {
        id: 143,
        title: 'Стлплтарнклитролстар',
        description: 'Стальные лисы» — это профессиональная команда по хоккею',
        image: '',
        createdAt: '2024-09-10T07:50:22.427Z',
        updatedAt: '2024-09-10T07:50:22.427Z',
        users: [],
    } as Team

    const mockTeamsService = {
        createTeam: jest.fn((dto: TeamDto, image) => Promise.resolve(mockTeam)),
        getAllTeams: jest.fn(() => Promise.resolve([mockTeam])),
        addUserToTeam: jest.fn((teamId: number, userId: number) =>
            Promise.resolve(mockTeam)
        ),
        cutUserToTeam: jest.fn((userId: number, teamId: number) =>
            Promise.resolve(mockTeam)
        ),
        getTeamById: jest.fn((id: number) => Promise.resolve(mockTeam)),
        changeTeamData: jest.fn((dto: TeamDto, id: number, imageUrl: any) =>
            Promise.resolve(mockTeam)
        ),
        deleteTeam: jest.fn((id: number) =>
            Promise.resolve({
                status: 200,
                message: 'Team deleted successfully',
            })
        ),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [
                {
                    provide: TeamsService,
                    useValue: mockTeamsService,
                },
            ],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile()

        controller = module.get<TeamsController>(TeamsController)
        service = module.get<TeamsService>(TeamsService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('createTeam', () => {
        it('should create a team and return it', async () => {
            const dto = {
                title: 'Team A',
                description: 'Description',
            }
            const result = await controller.createTeam(dto, {
                buffer: Buffer.from('image data'),
            })
            expect(result).toEqual(mockTeam)
            expect(service.createTeam).toHaveBeenCalledWith(dto, {
                buffer: Buffer.from('image data'),
            })
        })
    })

    describe('getAll', () => {
        it('should return an array of teams', async () => {
            const result = await controller.getAll()
            expect(result).toEqual([mockTeam])
            expect(service.getAllTeams).toHaveBeenCalled()
        })
    })

    describe('addUserToTeam', () => {
        it('should add a user to a team', async () => {
            const dto: InteractionTeamDto = { teamId: 1, userId: 2 }
            const result = await controller.addUserToTeam(dto)
            expect(result).toEqual(mockTeam)
            expect(service.addUserToTeam).toHaveBeenCalledWith(
                dto.teamId,
                dto.userId
            )
        })
    })

    describe('cutUserToTeam', () => {
        it('should remove a user from a team', async () => {
            const dto: InteractionTeamDto = { teamId: 1, userId: 2 }
            const result = await controller.cutUserToTeam(dto)
            expect(result).toEqual(mockTeam)
            expect(service.cutUserToTeam).toHaveBeenCalledWith(
                dto.userId,
                dto.teamId
            )
        })
    })

    describe('getTeamById', () => {
        it('should return a team by ID', async () => {
            const result = await controller.getTeamById(1)
            expect(result).toEqual(mockTeam)
            expect(service.getTeamById).toHaveBeenCalledWith(1)
        })
    })

    describe('changeTeamData', () => {
        it('should update team data and return it', async () => {
            const dto: TeamDto = {
                title: 'Updated Team',
                description: 'Updated Description',
            }
            const result = await controller.changeTeamDate(1, dto, {
                buffer: Buffer.from('image data'),
            })
            expect(result).toEqual(mockTeam)
            expect(service.changeTeamData).toHaveBeenCalledWith(dto, 1, {
                buffer: Buffer.from('image data'),
            })
        })
    })

    describe('deleteTeam', () => {
        it('should delete a team by ID', async () => {
            const result = await controller.deleteTeam(1)
            expect(result).toEqual({
                status: 200,
                message: 'Team deleted successfully',
            })
            expect(service.deleteTeam).toHaveBeenCalledWith(1)
        })
    })
})
