import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectModel } from '@nestjs/sequelize'
import { Role } from './model/roles.model'
import { findOrThrow } from 'src/helpers/findOrThrow'
import { findOrThrowWithValidation } from 'src/helpers/findOrThrowWithValidation'

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto)
        return role
    }

    async getAll() {
        const role = await this.roleRepository.findAll({
            include: { all: true },
        })
        return role
    }

    async getRoleByTitle(title: string) {
        const role = await findOrThrow(
            this.roleRepository,
            title,
            'title',
            {
                include: { all: true },
            },
            'Role'
        )
        return role
    }

    async getRoleById(id: number) {
        const role = await findOrThrowWithValidation(
            this.roleRepository,
            id,
            {
                include: { all: true },
            },
            'Role'
        )
        return role
    }

    async deleteRole(
        id: number
    ): Promise<{ status: HttpStatus; message: string }> {
        const role = await findOrThrowWithValidation<Role>(
            this.roleRepository,
            id,
            { include: { all: true } },
            'Role'
        )
        try {
            await role.destroy()
            Logger.log(`Role ${id} was deleted successfully`)
            return {
                status: HttpStatus.OK,
                message: 'Role deleted successfully',
            }
        } catch (error) {
            Logger.log(`Error deleting Role with id ${id}: ${error.message}`)
            throw new HttpException(
                'Error deleting Role',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateRole(id: number, dto) {
        const role = await findOrThrowWithValidation<Role>(
            this.roleRepository,
            id,
            { include: { all: true } },
            'Role'
        )
        role.title = dto.title
        role.description = dto.description
        await role.save()
        return role
    }
}
