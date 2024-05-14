import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/modules/users/users.service'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/modules/users/model/users.model'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto)
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

    private async validateUser(dto: LoginDto) {
        const user = await this.userService.getUserAuthInfo(
            dto.private_nickname
        )
        const passwordEquals = await bcrypt.compare(
            dto.password,
            user.auth.password
        )
        if (user && passwordEquals) {
            return user
        }
        Logger.log('Wrong email or password')
        throw new UnauthorizedException({ message: 'Wrong email or password' })
    }
}
