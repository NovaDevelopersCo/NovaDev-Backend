import { ApiProperty } from '@nestjs/swagger'
export class CreateClientDto {
    @ApiProperty({ example: 'Mars', description: 'Имя' })
    name: string

    @ApiProperty({ example: '@igornezimin', description: 'Айди телеграма' })
    tg: string

    @ApiProperty({ example: '+79261234567', description: 'Телефон' })
    phone: string | null
}
