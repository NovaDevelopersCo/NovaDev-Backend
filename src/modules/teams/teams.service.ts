import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Team } from './model/teams.model'
import { FilesService } from '../files/files.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { ChangeTeamDateDto } from './dto/change-team.dto'

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

    async getTeamByTitle(title) {
        const team = await this.teamRepository.findOne({
            where: { title },
            include: { all: true },
        })
        return team
    }

    async getTeamById(id) {
        const team = await this.teamRepository.findOne({ where: { id } })
        return team
    }

    async createTeam(dto: CreateTeamDto, image: any) {
        const fileName = await this.fileService.createFile(image)
        const team = await this.teamRepository.create({
            ...dto,
            image: fileName,
        })
        return team
    }

    async delTeam(id) {
        const team = await this.teamRepository.findByPk(id)
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }
        try {
            await team.destroy()
            Logger.log(`Team ${id} was deleted successfully`)
            return { message: 'Team deleted successfully', team }
        } catch (error) {
            Logger.log(`Error deleting team with id ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting team',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async changeTeamDate(dto: ChangeTeamDateDto, id) {
        const team = await this.teamRepository.findByPk(id)
        if (!team) {
            throw new HttpException(
                'Team not found',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        if (dto.newTitle) {
            team.title = dto.newTitle
        }
        if (dto.newDescription) {
            team.description = dto.newDescription
        }
        await team.save()

        return {
            newTitle: dto.newTitle,
            newDescription: dto.newDescription,
        }
    }
}
