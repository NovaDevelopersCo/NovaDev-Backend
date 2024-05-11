import { ApiProperty } from '@nestjs/swagger'

export class CreateTariffDto {
    @ApiProperty({ example: 3, description: 'Значение тарифа' })
    readonly title: string

    @ApiProperty({ example: 'Базовый тариф', description: 'Описание тарифа' })
    readonly description: string

    @ApiProperty({ example: '4999', description: 'Цена тарифа' })
    readonly price: number

    @ApiProperty({ example: 1, description: 'Уровень доступа' })
    readonly level_access: number
}
