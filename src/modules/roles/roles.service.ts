import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectModel } from '@nestjs/sequelize'
import { Role } from './model/roles.model'

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
        const role = await this.roleRepository.findOne({ where: { title } })
        return role
    }

    async getRoleById(id: number) {
        const role = await this.roleRepository.findOne({ where: { id } })
        return role
    }

    async deleteRole(id: number) {
        await this.roleRepository.destroy({ where: { id } })
        return { status: HttpStatus.OK, message: 'Role deleted' }
    }

    async updateRole(id: number, dto) {
        const role = await this.getRoleById(id)
        if (!role) {
            throw new Error('Role not found')
        }
        role.title = dto.title
        role.description = dto.description
        await role.save()
        return role
    }
}
