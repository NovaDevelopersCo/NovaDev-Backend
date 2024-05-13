import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { User } from './model/users.model'
import { InjectModel } from '@nestjs/sequelize'
import { RolesService } from '../roles/roles.service'
import { ChangeUserDateDto } from './dto/change-user.dto'
import { BanUserDto } from './dto/ban-user.dto'
import * as bcrypt from 'bcryptjs'
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService
    ) {}
    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: { all: true },
        })
        Logger.log('Everyone users got:' + users.length)
        return users
    }

    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        })
        Logger.log('User with email: ' + user.email + 'got')
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

    async createUser() {
        const plainPassword = Math.random().toString(36).slice(-8)
        const hashPassword = await bcrypt.hash(plainPassword, 10)

        const user = await this.userRepository.create({
            email: Math.random().toString(36).slice(-8) + '@nova.com',
            password: hashPassword,
        })

        const role = await this.roleService.getRoleByTitle('SUPER_ADMIN')
        if (user && role) {
            user.roleId = role.id
            await user.save()
        }

        const credential = {
            login: user.email,
            password: plainPassword,
        }

        Logger.log('User created successfully')
        return credential
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
            user.email = dto.newEmail
        }
        if (dto.newPassword) {
            const hashPassword = await bcrypt.hash(dto.newPassword, 10)
            user.password = hashPassword
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

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        if (!user) {
            Logger.log('User not found')
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        try {
            user.banned = true
            user.banReason = dto.banReason
            await user.save()
            Logger.log('User banned successfully')
            return user
        } catch {
            Logger.log('Error banning user')
            throw new HttpException(
                'Error banning user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
