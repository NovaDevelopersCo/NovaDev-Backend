import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { User } from './model/users.model'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { ChangeUserDateDto } from './dto/change-user.dto'
import { JwtAuthGuard } from 'src/guards/JwtAuth.guard'
import { ChangeMyselfDateDto } from './dto/change-myself.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers()
    }

    @ApiOperation({ summary: 'Получить пользователя по Email' })
    @ApiResponse({ status: 200, type: [User] })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Get('/email')
    getUserByEmail(@Body('email') email: string) {
        return this.userService.getUserByEmail(email)
    }

    @ApiOperation({ summary: 'Получить пользователя по айди' })
    @ApiResponse({ status: 200, type: [User] })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Get('/:id')
    getUserById(@Param('id') id: number) {
        return this.userService.getUserById(+id)
    }

    @ApiOperation({ summary: 'Получения пользователя по токену' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Post('/me')
    async getMe(@Request() req) {
        const id = req.user.id
        return this.userService.getUserById(id)
    }

    @ApiOperation({ summary: 'Замена информации самим пользователем' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Put('/me')
    @UseInterceptors(FileInterceptor('image'))
    async changeMyselfDate(
        @Body() dto: ChangeMyselfDateDto,
        @Request() req,
        @UploadedFile() imageUrl: any
    ) {
        const userId = req.user.id
        return this.userService.changeMyselfDate(dto, userId, imageUrl)
    }

    @ApiOperation({ summary: 'Замена роли, email, пароля' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT-auth')
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Put('/:id')
    async changeUserDate(
        @Param('id') id: number,
        @Body() dto: ChangeUserDateDto
    ) {
        return this.userService.changeUserDate(dto, id)
    }

    @Post('/createUser')
    @ApiOperation({ summary: 'Создать пользователя' })
    @ApiResponse({ status: 200 })
    createUser() {
        return this.userService.createUser()
    }

    @ApiOperation({ summary: 'Удалить Пользывателя' })
    @ApiResponse({ status: 200 })
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    @Delete('/:id')
    delUser(@Param('id') id: number) {
        return this.userService.delUser(id)
    }
}
