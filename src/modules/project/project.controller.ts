import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common'
import { ProjectService } from './Project.service'
import { CreateProjectDto } from './dto/create-project.dto'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Project } from './model/Project.model'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { InteractionProjectDto } from './dto/interaction-project.dto'

@ApiTags('Проекты')
@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService) {}

    @ApiOperation({ summary: 'Создание Проекта' })
    @ApiResponse({ status: 200, type: Project })
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.projectService.createProject(dto)
    }

    @ApiOperation({ summary: 'Получение проекта по названию' })
    @ApiResponse({ status: 200, type: Project })
    @Get('/:title')
    getBytitle(@Param('title') title: string) {
        return this.projectService.getProjectByTitle(title)
    }

    @ApiOperation({ summary: 'Получение проекта по айди' })
    @ApiResponse({ status: 200, type: Project })
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.projectService.getProjectById(id)
    }

    @ApiOperation({ summary: 'Обновление проекта' })
    @ApiResponse({ status: 200, type: Project })
    @Put('/:id')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    updateProject(@Param('id') id: number, @Body() dto: CreateProjectDto) {
        return this.projectService.updateProject(id, dto)
    }

    @ApiOperation({ summary: 'Добавление юзера на проект' })
    @ApiResponse({ status: 200, type: Project })
    @Put('/add')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    addUser(@Body() dto: InteractionProjectDto) {
        return this.projectService.AddUserToProject(dto.projectId, dto.userId)
    }

    @ApiOperation({ summary: 'Удаление юзера из проекта' })
    @ApiResponse({ status: 200, type: Project })
    @Put('/cut')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    cutUser(@Body() dto: InteractionProjectDto) {
        return this.projectService.CutUserToProject(dto.projectId, dto.userId)
    }

    @ApiOperation({ summary: 'Удаление Проекта' })
    @ApiResponse({ status: 200, type: Project })
    @Delete('/:id')
    @Roles('SUPER_ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    deleteProject(@Param('id') id: number) {
        return this.projectService.deleteProject(id)
    }

    @ApiOperation({ summary: 'Получение всех проектов' })
    @ApiResponse({ status: 200, type: Project })
    @Get()
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    getAll() {
        return this.projectService.getAll()
    }
}
