import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Team } from './model/teams.model'
import { TeamDto } from './dto/create-team.dto'
import { User } from '../users/model/users.model'
import { UploadService } from '../upload/upload.service'
import { findOrThrow } from 'src/helpers/findOrThrow'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'
@Injectable()
export class TeamsService {
    constructor(
        @InjectModel(Team) private teamRepository: typeof Team,
        private UploadRepository: UploadService,
        @InjectModel(User) private userRepository: typeof User
    ) {}

    async getAllTeams() {
        const teams = await this.teamRepository.findAll({
            include: [
                {
                    model: User,
                    attributes: { exclude: ['auth'] },
                },
            ],
        })
        return teams
    }
    А

    async getTeamByTitle(title: string): Promise<Team> {
        const team = await findOrThrow<Team>(
            this.teamRepository,
            title,
            'title',
            {
                include: { all: true },
            }
        )
        return team
    }

    async getTeamById(id: number) {
        const team = await findOrThrowWithValidation<Team>(
            this.teamRepository,
            id,
            { include: { all: true } },
            'Team'
        )

        return team
    }

    async addUserToTeam(
        teamId: number,
        userId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await findOrThrow<Team>(
            this.teamRepository,
            teamId,
            'id',
            { include: { all: true } },
            'Team'
        )

        const user = await findOrThrow<User>(
            this.userRepository,
            userId,
            'id',
            { include: { all: true } },
            'User'
        )

        if (user.teamId === teamId) {
            throw new HttpException(
                'User is already in the team',
                HttpStatus.BAD_REQUEST
            )
        }

        user.teamId = teamId
        await user.save()

        Logger.log(`User with ID ${userId} added to team with ID ${teamId}`)
        return { status: HttpStatus.CREATED, message: 'successful' }
    }
    В

    async cutUserToTeam(
        userId: number,
        teamId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await findOrThrow<Team>(
            this.teamRepository,
            teamId,
            'id',
            { include: { all: true } },
            'Team'
        )

        const user = await findOrThrow<User>(
            this.userRepository,
            userId,
            'id',
            { include: { all: true } },
            'User'
        )

        if (user.teamId !== teamId) {
            Logger.log(
                `User with ID ${userId} does not have team with ID ${teamId}`
            )
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'failed',
            }
        }
        user.teamId = null
        await user.save()

        Logger.log(`Team with ID ${teamId} removed from user with ID ${userId}`)
        return {
            status: HttpStatus.OK,
            message: 'successful',
        }
    }
    async createTeam(dto: TeamDto, image: any): Promise<Team> {
        let imageUrl: string = ''

        if (image) {
            imageUrl = await this.UploadRepository.uploadFile(image)
        }

        try {
            const team = await this.teamRepository.create({
                ...dto,
                image: imageUrl,
            })

            return team
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(
                    'Команда с таким названием уже существует.'
                )
            }
            throw error
        }
    }

    async deleteTeam(
        id: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await findOrThrowWithValidation<Team>(
            this.teamRepository,
            id,
            { include: { all: true } },
            'Team'
        )
        try {
            await team.destroy()
            Logger.log(`Team ${id} was deleted successfully`)
            return {
                status: HttpStatus.OK,
                message: 'Team deleted successfully',
            }
        } catch (error) {
            Logger.log(`Error deleting team with id ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting team',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async changeTeamData(
        dto: TeamDto,
        id: number,
        imageUrl?: any
    ): Promise<Team> {
        const team = await findOrThrowWithValidation<Team>(
            this.teamRepository,
            id,
            { include: { all: true } },
            'Team'
        )
        let image: string = ''

        if (imageUrl) {
            image = await this.UploadRepository.uploadFile(imageUrl)
        }

        Object.assign(team, dto, image ? { image } : {})

        try {
            await team.save()
        } catch (error) {
            throw new HttpException(
                'Failed to update team',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        return team
    }
}
