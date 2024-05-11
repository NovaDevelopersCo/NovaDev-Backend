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
import { TariffService } from './tariff.service'
import { CreateTariffDto } from './dto/create-tariff.dto'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Tariff } from './model/tariff.model'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles-auth.decorator'

@ApiTags('Тарифы')
@Controller('tariff')
export class TariffController {
    constructor(private tariffService: TariffService) {}

    @ApiOperation({ summary: 'Создание Тарифа' })
    @ApiResponse({ status: 200, type: Tariff })
    @ApiBearerAuth('JWT-auth')
    @Roles('SUPER_ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: CreateTariffDto) {
        return this.tariffService.createTariff(dto)
    }

    @ApiOperation({ summary: 'Получение Тарифа по Названию' })
    @ApiResponse({ status: 200, type: Tariff })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('/:title')
    getBytitle(@Param('title') title: string) {
        return this.tariffService.getTariffByTitle(title)
    }
    @ApiOperation({ summary: 'Получение Тарифа по Айди' })
    @ApiResponse({ status: 200, type: Tariff })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.tariffService.getTariffById(id)
    }

    @ApiOperation({ summary: 'Удаление Тарифа' })
    @Delete('/:id')
    @Roles('SUPER_ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    deleteRole(@Param('id') id: number) {
        return this.tariffService.deleteTariff(id)
    }
    @ApiOperation({ summary: 'Получения Всех Тарифа' })
    @Get()
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    getAll() {
        return this.tariffService.getAll()
    }
}
