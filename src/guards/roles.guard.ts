import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles-auth.decorator'
import { Roles } from 'src/helpers/rolesLevelAccess'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRole = this.reflector.getAllAndOverride<string>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()]
            )
            if (!requiredRole) {
                return true
            }

            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization

            if (!authHeader) {
                throw new HttpException(
                    'Пользыватель не авторизован',
                    HttpStatus.UNAUTHORIZED
                )
            }

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new HttpException(
                    'Пользыватель не авторизован',
                    HttpStatus.UNAUTHORIZED
                )
            }

            let user
            try {
                user = this.jwtService.verify(token)
            } catch (error) {
                throw new HttpException(
                    'Пользыватель не авторизован',
                    HttpStatus.UNAUTHORIZED
                )
            }

            req.user = user

            if (user.role.level_access < Roles[requiredRole]) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
            } else {
                return true
            }
        } catch (error) {
            if (
                error instanceof UnauthorizedException ||
                error instanceof HttpException
            ) {
                throw error
            }
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}
