import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { TeamDto } from './dto/team.dto'
import { TeamsService } from './teams.service'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Team } from './model/teams.model'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@Controller('teams')
export class TeamsController {
    constructor(private teamsService: TeamsService) {}

    @ApiOperation({ summary: 'Создать команду' })
    @ApiResponse({ status: 200, type: Team })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createTeam(@Body() dto: TeamDto, @UploadedFile() image) {
        return this.teamsService.createTeam(dto, image)
    }

    @ApiOperation({ summary: 'Получить все команды' })
    @ApiResponse({ status: 200, type: Team })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.teamsService.getAllTeams()
    }

    @ApiOperation({ summary: 'Получить команду по названию' })
    @ApiResponse({ status: 200, type: Team })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Get('/title')
    getTeamByTitle(@Param('title') title: string) {
        return this.teamsService.getTeamByTitle(title)
    }

    @ApiOperation({ summary:"Получение комады по айди"})
    @ApiResponse({ status:200, type: Team })
    @Roles("ADMIN")
    @ApiBearerAuth("JWT-auth")
    @UseGuards(RolesGuard)
    @Get("/:id")
    getTeamById(@Param("id")id:number) {
        return this.teamsService.getTeamById(id)
    }

    @ApiOperation({ summary: 'Заменить название, описание, картинку' })
    @ApiResponse({ status: 200, type: Team })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Put('/:id')
    changeTeamDate(@Param('id') id: number, @Body() dto: TeamDto) {
        return this.teamsService.changeTeamDate(dto, id)
    }

    @ApiOperation({ summary: 'Удалить команду' })
    @ApiResponse({ status: 200, type: Team })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Delete('/:id')
    deleteTeam(@Param('id') id: number) {
        return this.teamsService.deleteTeam(id)
    }
}
