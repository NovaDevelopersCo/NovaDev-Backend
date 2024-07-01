import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { User } from './model/users.model'
import { InjectModel } from '@nestjs/sequelize'
import { RolesService } from '../roles/roles.service'

import { ChangeUserDateDto } from './dto/change-user.dto'
import * as bcrypt from 'bcryptjs'
import { TeamsService } from '../teams/teams.service'
import { ChangeMyselfDateDto } from './dto/change-myself.dto'
import { UploadService } from '../upload/upload.service'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
        private teamService: TeamsService,
        private uploadRepository: UploadService
    ) {}
    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: { all: true },
            attributes: { exclude: ['auth'] },
        })
        Logger.log('Everyone users got:' + users.length)
        return users
    }

    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({
            where: {
                'auth.private_nickname': email,
            },
            include: { all: true },
        })
        Logger.log('User with email: ' + user.auth.private_nickname + 'got')
        return user
    }

    async delUser(id) {
        const user = await this.userRepository.findByPk(id)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        try {
            await user.destroy()
            Logger.log(`User ${id} was deleted successfully`)
            return { message: 'User deleted successfully', user }
        } catch (error) {
            Logger.log(`Error deleting user with email ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getUserAuthInfo(private_nickname) {
        const user = await this.userRepository.findOne({
            where: {
                'auth.private_nickname': private_nickname,
            },
            include: { all: true },
        })
        Logger.log('User with email: ' + user.auth.private_nickname + 'got')
        return user
    }

    async createUser() {
        const plainPassword = Math.random().toString(36).slice(-8)
        const hashPassword = await bcrypt.hash(plainPassword, 10)
        const login = Math.random().toString(36).slice(-8) + '@nova.com'

        const user = await this.userRepository.create({
            auth: {
                password: hashPassword,
                private_nickname: login,
            },
            tg_id: null,
        })

        const role = await this.roleService.getRoleByTitle('SUPER_ADMIN')
        if (user && role) {
            user.roleId = role.id
            await user.save()
        }

        const team = await this.teamService.getTeamByTitle('Cool Team')
        if (user && team) {
            user.teamId = team.id
            await user.save()
        }

        const credential = {
            login: login,
            password: plainPassword,
        }

        Logger.log('User created successfully')
        return credential
    }

    async changeMyselfDate(
        dto: ChangeMyselfDateDto,
        userId: number,
        imageUrl?: any
    ): Promise<User> {
        const user = await this.userRepository.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const updatedFields = { ...dto }
        if (imageUrl) {
            const uploadedImageUrl =
                await this.uploadRepository.uploadFile(imageUrl)
            updatedFields['image'] = uploadedImageUrl
        }

        try {
            await this.userRepository.update(
                { info: { ...user.info, ...updatedFields } },
                { where: { id: userId } }
            )

            const updatedUser = await this.userRepository.findByPk(userId)
            return updatedUser
        } catch (error) {
            throw new HttpException(
                'Failed to update user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async changeUserDate(dto: ChangeUserDateDto, id) {
        const user = await this.userRepository.findByPk(id)
        if (!user) {
            throw new HttpException(
                'User not found',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        if (dto.newEmail) {
            user.auth.private_nickname = dto.newEmail
        }
        if (dto.newPassword) {
            const hashPassword = await bcrypt.hash(dto.newPassword, 10)
            user.auth.password = hashPassword
        }
        if (dto.newRole) {
            const role = await this.roleService.getRoleByTitle(dto.newRole)
            if (role) {
                user.roleId = role.id
            }
        }
        Logger.log('User change successfully')
        await user.save()

        return {
            newEmail: dto.newEmail,
            newPassword: dto.newPassword,
            newRole: dto.newRole,
        }
    }
}
