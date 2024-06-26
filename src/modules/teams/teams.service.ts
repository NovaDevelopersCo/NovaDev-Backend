import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Team } from './model/teams.model'
import { TeamDto } from './dto/team.dto'
import { User } from '../users/model/users.model'
import { UploadService } from '../upload/upload.service'
@Injectable()
export class TeamsService {
    constructor(
        @InjectModel(Team) private teamRepository: typeof Team,
        private UploadRepository: UploadService,
        @InjectModel(User) private userRepository: typeof User
    ) {}

    async getAllTeams() {
        const teams = await this.teamRepository.findAll({
            include: { all: true },
        })
        return teams
    }

    async getTeamByTitle(title: string) {
        const team = await this.teamRepository.findOne({
            where: { title },
            include: { all: true },
        })
        return team
    }

    async getTeamById(id: number) {
        const team = await this.teamRepository.findOne({ where: { id } })
        return team
    }

    async addUserToTeam(
        teamId: number,
        userId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await this.teamRepository.findByPk(teamId)
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }

        const user = await User.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        if (user.teamId === teamId) {
            throw new HttpException(
                'User is already in the team',
                HttpStatus.BAD_REQUEST
            )
        }

        user.teamId = teamId
        await user.save()

        Logger.log(`User with ID ${userId} added to team with ID ${teamId}`)
        return { status: HttpStatus.OK, message: 'successfully' }
    }
    В

    async cutUserToTeam(
        userId: number,
        teamId: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await this.teamRepository.findByPk(teamId)

        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }

        const user = await User.findByPk(userId)

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        if (user.teamId !== teamId) {
            Logger.log(
                `User with ID ${userId} does not have team with ID ${teamId}`
            )
            return {
                status: HttpStatus.CONFLICT,
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

        const team = await this.teamRepository.create({
            ...dto,
            image: imageUrl,
        })

        return team
    }

    async deleteTeam(
        id: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const team = await this.teamRepository.findByPk(id)
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }
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
        const team = await this.teamRepository.findByPk(id)
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }

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
