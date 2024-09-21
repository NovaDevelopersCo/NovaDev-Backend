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
import { ClientService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Client } from './model/client.model'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { InteractionClientDto } from './dto/interaction-client.dto'

@ApiTags('Клиенты')
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @ApiOperation({ summary: 'Создание Клиента' })
    @ApiResponse({ status: 200, type: Client })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: CreateClientDto) {
        return this.clientService.createClinet(dto)
    }
    @ApiOperation({ summary: 'Получение клиента по айди' })
    @ApiResponse({ status: 200, type: Client })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.clientService.getClientById(id)
    }

    @ApiOperation({ summary: 'Обновление клиента' })
    @ApiResponse({ status: 200, type: Client })
    @Put('/:id')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    updateProject(@Param('id') id: number, @Body() dto: CreateClientDto) {
        return this.clientService.updateClient(id, dto)
    }

    @ApiOperation({ summary: 'Добавление клиента на проект' })
    @ApiResponse({ status: 200, type: Client })
    @Post('/add')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    addUser(@Body() dto: InteractionClientDto) {
        return this.clientService.addClientToProject(
            dto.projectId,
            dto.clientId
        )
    }

    @ApiOperation({ summary: 'Удаление клиента из проекта' })
    @ApiResponse({ status: 200, type: Client })
    @Post('/cut')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    cutUser(@Body() dto: InteractionClientDto) {
        return this.clientService.CutClientToProject(
            dto.projectId,
            dto.clientId
        )
    }

    @ApiOperation({ summary: 'Удаление Клиента' })
    @ApiResponse({ status: 200, type: Client })
    @Delete('/:id')
    @Roles('SUPER_ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    deleteProject(@Param('id') id: number) {
        return this.clientService.deleteClient(id)
    }

    @ApiOperation({ summary: 'Получение всех клиентов' })
    @ApiResponse({ status: 200, type: Client })
    @Get()
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    getAll() {
        return this.clientService.getAll()
    }
}
