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
import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Tags } from './model/tags.model'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { InteractionTagDto } from './dto/interaction-tag.dto'

@ApiTags('Теги')
@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @ApiOperation({ summary: 'Создание Тега' })
    @ApiResponse({ status: 200, type: Tags })
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: CreateTagDto) {
        return this.tagsService.createTag(dto)
    }

    @ApiOperation({ summary: 'Получение тега по названию' })
    @ApiResponse({ status: 200, type: Tags })
    @Get('/:title')
    getBytitle(@Param('title') title: string) {
        return this.tagsService.getTagByTitle(title)
    }
    @ApiOperation({ summary: 'Добавление тега к пользывателю' })
    @ApiResponse({ status: 200, type: Tags })
    @Post('/add')
    giveTag(@Body() dto: InteractionTagDto) {
        return this.tagsService.GiveTag(dto.Tagid, dto.userId)
    }
    @ApiOperation({ summary: 'Удаление тега у пользывателю' })
    @ApiResponse({ status: 200, type: Tags })
    @Post('/cut')
    cutTag(@Body() dto: InteractionTagDto) {
        return this.tagsService.CutTag(dto.Tagid, dto.userId)
    }

    @ApiOperation({ summary: 'Получение тега по айди' })
    @ApiResponse({ status: 200, type: Tags })
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.tagsService.getTagById(id)
    }

    @ApiOperation({ summary: 'Обновление тега' })
    @ApiResponse({ status: 200, type: Tags })
    @Put('/:id')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    updateTag(@Param('id') id: number, @Body() dto: CreateTagDto) {
        return this.tagsService.updateTag(id, dto)
    }

    @ApiOperation({ summary: 'Удаление Тега' })
    @ApiResponse({ status: 200, type: Tags })
    @Delete('/:id')
    @Roles('SUPER_ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    deleteTag(@Param('id') id: number) {
        return this.tagsService.deleteTag(id)
    }

    @ApiOperation({ summary: 'Получение всех тегов' })
    @ApiResponse({ status: 200, type: Tags })
    @Get()
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    getAll() {
        return this.tagsService.getAll()
    }
}
