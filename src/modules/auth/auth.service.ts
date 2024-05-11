import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto'
import { UsersService } from 'src/modules/users/users.service'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/modules/users/model/users.model'

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        Logger.log('User was logged in successfully')
        return this.generateToken(user)
    }

    async validateToken() {
        return { message: 'valid' }
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, role: user.role }
        return {
            token: this.jwtService.sign(payload),
        }
    }
    private extractToken(authorizationHeader: string): string {
        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith('Bearer ')
        ) {
            throw new UnauthorizedException('Invalid authorization header')
        }
        return authorizationHeader.split(' ')[1]
    }
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        const passwordEquals = await bcrypt.compare(
            userDto.password,
            user.password
        )
        if (user && passwordEquals) {
            return user
        }
        Logger.log('Wrong email or password')
        throw new UnauthorizedException({ message: 'Wrong email or password' })
    }
}
