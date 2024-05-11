import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { CreateUserDto } from 'src/modules/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Roles } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto)
    }

    @ApiOperation({
        summary: 'Проверка токена на валидность, role: SUPER_ADMIN, ADMIN',
    })
    @ApiResponse({ status: 200 })
    @Get('/validate/token')
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    async validateToken() {
        return this.authService.validateToken()
    }
}
