import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateTariffDto } from './dto/create-tariff.dto'
import { InjectModel } from '@nestjs/sequelize'
import { Tariff } from './model/tariff.model'

@Injectable()
export class TariffService {
    constructor(@InjectModel(Tariff) private tariffRepository: typeof Tariff) {}

    async createTariff(dto: CreateTariffDto) {
        const tariff = await this.tariffRepository.create(dto)
        return tariff
    }

    async getAll() {
        const tariff = await this.tariffRepository.findAll({
            include: { all: true },
        })
        return tariff
    }

    async getTariffByTitle(title: string) {
        const tariff = await this.tariffRepository.findOne({ where: { title } })
        return tariff
    }

    async getTariffById(id: number) {
        const tariff = await this.tariffRepository.findOne({ where: { id } })
        return tariff
    }

    async deleteTariff(id: number) {
        await this.tariffRepository.destroy({ where: { id } })
        return { status: HttpStatus.OK, message: 'Tariff deleted' }
    }

    async updateTariff(id: number, dto) {
        const tariff = await this.getTariffById(id)
        if (!tariff) {
            throw new Error('Tariff not found')
        }
        tariff.title = dto.title
        tariff.description = dto.description
        await tariff.save()
        return tariff
    }
}
