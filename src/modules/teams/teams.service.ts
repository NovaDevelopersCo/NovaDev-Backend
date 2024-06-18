import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Team } from './model/teams.model'
import { FilesService } from '../files/files.service'
import { TeamDto } from './dto/team.dto'

@Injectable()
export class TeamsService {
    constructor(
        @InjectModel(Team) private teamRepository: typeof Team,
        private fileService: FilesService
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

    async createTeam(dto: TeamDto, image: any) {
        const fileName = await this.fileService.createFile(image)
        const team = await this.teamRepository.create({
            ...dto,
            image: fileName,
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

    async changeTeamDate(dto: TeamDto, id: number): Promise<TeamDto> {
        const team = await this.teamRepository.findByPk(id)
        if (!team) {
            throw new HttpException(
                'Team not found',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        Object.assign(team, dto)
        try {
            await team.save()
        } catch (error) {
            throw new HttpException(
                'Falied to update team',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        return team
    }
}
